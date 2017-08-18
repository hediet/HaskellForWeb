import { range, repeat1, repeat0, StaticLexingRules, concat, oneOf,
     matches, or, ResultFactory, any, noneOfChars, optional } from "typed-lexer";

import { TokenKinds, reservedIds, reservedOps, specialTokens } from "./generated";

type State = "start" | "inRangeBlock";

function getTokenKindByName(name: string): TokenKinds {
    return (TokenKinds as any)[name];
}

export class HaskellLexingRules extends StaticLexingRules<TokenKinds, State> {
    constructor() {
        super("start");
    
        const newline = oneOf("\r\n", "\r", "\n");
        const whiteChar = oneOf(" ", "\t");

        const ascSmall = range("a", "z");
        const small = oneOf(ascSmall, "_");

        const ascLarge = range("A", "Z");
        const large = ascLarge;

        const digit = range("0", "9");
        const octit = range("0", "7");
        const hexit = oneOf(digit, range("A", "F"), range("a", "f"));

        const decimal = repeat1(digit);
        const octal = repeat1(octit);
        const hexadecimal = repeat1(hexit);

        const idCont = repeat0(oneOf(small, large, digit, "'"));
        const varid = small.concat(idCont);
        const conid = large.concat(idCont);

        const ascSymbolChars = ["!", "#", "$", "%", "&", "*", "+",
            ".", "/", "<", "=", ">", "?", "@", "\\", "^", "|", "-", "~", ":"];
        const ascSymbol = oneOf(...ascSymbolChars);
        const symbol = ascSymbol;

        const varOrConSym = repeat1(symbol); // test for reservedOp and whether it starts with ":" (=> conSym)

        const integer = oneOf(
            decimal,
            oneOf("0o", "0O").concat(octal),
            oneOf("0x", "0X").concat(hexadecimal)
        );

        const float = concat(decimal, ".", decimal);

        const r = this.rules;

        const start = matches<State>("start");
        const inRangeBlock = matches<State>("inRangeBlock");

        r.addSimpleRule(repeat1(whiteChar), TokenKinds.Whitespace);

        r.addSimpleRule(newline, TokenKinds.NewLine);

        r.addSimpleRule(integer, TokenKinds.Integer, start);
        r.addSimpleRule(float, TokenKinds.Float, start);

        r.addSimpleRule(/".*?"/, TokenKinds.String);

        for (const [ key, name ] of Object.entries(specialTokens)) {
            r.addSimpleRule(key, getTokenKindByName(name), start);
        }
        
        r.addRule(varid, (matched, ret) => {
            const tokenKindName = (reservedIds as any)[matched] as (keyof TokenKinds) | undefined;
            if (tokenKindName) {
                const kind = getTokenKindByName(tokenKindName);
                return ret.token(kind);
            }

            return ret.token(TokenKinds.VariableId);
        }, start);
        
        r.addSimpleRule(conid, TokenKinds.ConstructorId);

        function classifyVarOrConSym(str: string): TokenKinds {
            if (str.indexOf(":") === 0) {
                return TokenKinds.ConstructorSymbol;
            }
            return TokenKinds.VariableSymbol;
        }

        r.addRule(varOrConSym, (matched, ret) => {
            const tokenKindName = (reservedOps as any)[matched] as (keyof TokenKinds) | undefined;
            if (tokenKindName) {
                const kind = getTokenKindByName(tokenKindName);
                return ret.token(kind);
            }

            return ret.token(classifyVarOrConSym(matched));
        });
    
        function splitAndReturnTokens(tokenTester: (lastPart: string) => TokenKinds) {
            return (matched: string, ret: ResultFactory<TokenKinds, State>) => {
                const tokens = [] as { length: number, token: TokenKinds }[];
                const parts = matched.split(".");
                for (let i = 0; i < parts.length; i++) {
                    const length = parts[i].length;
                    if (i < parts.length - 1) {
                        tokens.push({ length, token: TokenKinds.ModuleIdPart });
                        tokens.push({ length: 1, token: TokenKinds.ModuleIdDot });
                    }
                    else
                        tokens.push({ length, token: TokenKinds.VariableId });
                }
                return ret.tokensWithLen(tokens);
            }
        }

        const modid = repeat0(conid.concat(".")).concat(conid);

        r.addRule(modid.concat(".").concat(varid), splitAndReturnTokens(p => TokenKinds.VariableId));
        r.addRule(modid.concat(".").concat(conid), splitAndReturnTokens(p => TokenKinds.ConstructorId));
        r.addRule(modid.concat(".").concat(varOrConSym), splitAndReturnTokens(classifyVarOrConSym));

        r.addSimpleRule(concat("--").concat(repeat0("-"))
            .concat(optional(noneOfChars(ascSymbolChars).concat(repeat0(any))))
            .concat(newline), TokenKinds.Comment);

        r.addSimpleRule(/./, TokenKinds.Invalid, start);
    }
}

const str = `
invert :: (Integer -> Integer) -> Integer -> Integer -> Integer-> Integer
invert f lowerBound upperBound y
    | lowerBound > upperBound = error "Interval is empty"
    | lowerBound == upperBound = if f lowerBound <= y then lowerBound else error "Interval too small"
    | f mid <= y = invert f mid upperBound y
    | f mid > y = invert f lowerBound (mid-1) y
        -- Annahme lowerBound < mid <= upperBound wenn lowerBound != upperBound 
        where mid = (1 + lowerBound + upperBound) \`div\` 2
`;

function getWsLength(str: string) {
    let result = 0;
    for (let c of str) {
        if (c === " ")  result++;
        else if (c === "\n") result += 8;
        else throw "ws error";
    }

    return result;
}

const tokens = new HaskellLexingRules().lexTokensWithStr(str);

const layoutStack = [0];

for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.token === TokenKinds.LetKeyword || t.token === TokenKinds.WhereKeyword || t.token === TokenKinds.DoKeyword ||
            t.token === TokenKinds.OfKeyword) {
        // start of block token
        let lastIndentation = 0;
        let explicitIndentation = false;

        for (let j = i + 1; j < tokens.length; j++) {
            const nextToken = tokens[j].token;
            if (nextToken === TokenKinds.Whitespace)
                lastIndentation += getWsLength(tokens[j].str);
            else if (nextToken === TokenKinds.NewLine)
                lastIndentation = 0;
            else if (nextToken === TokenKinds.OpeningBrace) {
                explicitIndentation = true;
                break;
            }
            else if (nextToken !== TokenKinds.Comment) break;
        }

        const curIndent = layoutStack[layoutStack.length - 1];
    }
}



class LookaheadLexer<TToken> {
    private pos: number = 0;
    private stack: number[] = [];

    constructor(private tokens: TToken[]) {}

    public next(): TToken|undefined {
        const token = this.tokens[this.pos];
        this.pos++;
        return token;
    }

    public peek(): TToken|undefined {
        return this.tokens[this.pos];
    }

    public savePosition(): number {
        this.stack.push(this.pos);
        return this.stack.length;
    }

    public forgetSavedPosition(handle: number) {
        this.stack.pop();
    }

    public restoreSavedPosition(handle: number) {
        this.pos = this.stack.pop();
    }
}

type L = LookaheadLexer<any>;

class Parser {


    /*

    x =
    x@y =
    x@(a,b) =



    */
    private parseDeclaration() {
        // gendecl | pat | funlhs

        /*
        funlhs -> var apat*
               -> pat varop pat
               -> "(" funlhs ")" apat*
               
        pat -> lpat qconop pat
            -> lpat
        
        lpat -> apat
             -> - (integer | float)
             -> gcon apat+
        
        apat -> var ("@" apat)?
             -> gcon
             -> literal
             -> "(" pat ")"
             -> "(" pat ("," pat)*  ")"

        */

        if (this.tryRead(TokenKinds.VariableIdentifier)) {
            if (this.tryRead(TokenKinds.Comma) || this.tryRead(TokenKinds.DoubleColon)) {
                // gendecl
            }
            else {
                // pat | funlhs
                if (this.tryRead(TokenKinds.AtSign)) {
                    // read apat

                }
                else {
                    if (this.tryReadVarOp()) {
                        
                    }
                }
                // try read apats


            }

        }


        if (this.lex.peek().type == OpeningParen)
        
    }



    private parseLetExpression() {
        /*




        */
    }

}