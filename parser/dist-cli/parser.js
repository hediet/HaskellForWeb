"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_lexer_1 = require("typed-lexer");
const generated_1 = require("./generated");
function getTokenKindByName(name) {
    return generated_1.TokenKinds[name];
}
class HaskellLexingRules extends typed_lexer_1.StaticLexingRules {
    constructor() {
        super("start");
        const newline = typed_lexer_1.oneOf("\r\n", "\r", "\n");
        const whiteChar = typed_lexer_1.oneOf(" ", "\t");
        const ascSmall = typed_lexer_1.range("a", "z");
        const small = typed_lexer_1.oneOf(ascSmall, "_");
        const ascLarge = typed_lexer_1.range("A", "Z");
        const large = ascLarge;
        const digit = typed_lexer_1.range("0", "9");
        const octit = typed_lexer_1.range("0", "7");
        const hexit = typed_lexer_1.oneOf(digit, typed_lexer_1.range("A", "F"), typed_lexer_1.range("a", "f"));
        const decimal = typed_lexer_1.repeat1(digit);
        const octal = typed_lexer_1.repeat1(octit);
        const hexadecimal = typed_lexer_1.repeat1(hexit);
        const idCont = typed_lexer_1.repeat0(typed_lexer_1.oneOf(small, large, digit, "'"));
        const varid = small.concat(idCont);
        const conid = large.concat(idCont);
        const ascSymbolChars = ["!", "#", "$", "%", "&", "*", "+",
            ".", "/", "<", "=", ">", "?", "@", "\\", "^", "|", "-", "~", ":"];
        const ascSymbol = typed_lexer_1.oneOf(...ascSymbolChars);
        const symbol = ascSymbol;
        const varOrConSym = typed_lexer_1.repeat1(symbol); // test for reservedOp and whether it starts with ":" (=> conSym)
        const integer = typed_lexer_1.oneOf(decimal, typed_lexer_1.oneOf("0o", "0O").concat(octal), typed_lexer_1.oneOf("0x", "0X").concat(hexadecimal));
        const float = typed_lexer_1.concat(decimal, ".", decimal);
        const r = this.rules;
        const start = typed_lexer_1.matches("start");
        const inRangeBlock = typed_lexer_1.matches("inRangeBlock");
        r.addSimpleRule(typed_lexer_1.repeat1(whiteChar), generated_1.TokenKinds.Whitespace);
        r.addSimpleRule(newline, generated_1.TokenKinds.NewLine);
        r.addSimpleRule(integer, generated_1.TokenKinds.Integer, start);
        r.addSimpleRule(float, generated_1.TokenKinds.Float, start);
        r.addSimpleRule(/".*?"/, generated_1.TokenKinds.String);
        for (const [key, name] of Object.entries(generated_1.specialTokens)) {
            r.addSimpleRule(key, getTokenKindByName(name), start);
        }
        r.addRule(varid, (matched, ret) => {
            const tokenKindName = generated_1.reservedIds[matched];
            if (tokenKindName) {
                const kind = getTokenKindByName(tokenKindName);
                return ret.token(kind);
            }
            return ret.token(generated_1.TokenKinds.VariableId);
        }, start);
        r.addSimpleRule(conid, generated_1.TokenKinds.ConstructorId);
        function classifyVarOrConSym(str) {
            if (str.indexOf(":") === 0) {
                return generated_1.TokenKinds.ConstructorSymbol;
            }
            return generated_1.TokenKinds.VariableSymbol;
        }
        r.addRule(varOrConSym, (matched, ret) => {
            const tokenKindName = generated_1.reservedOps[matched];
            if (tokenKindName) {
                const kind = getTokenKindByName(tokenKindName);
                return ret.token(kind);
            }
            return ret.token(classifyVarOrConSym(matched));
        });
        function splitAndReturnTokens(tokenTester) {
            return (matched, ret) => {
                const tokens = [];
                const parts = matched.split(".");
                for (let i = 0; i < parts.length; i++) {
                    const length = parts[i].length;
                    if (i < parts.length - 1) {
                        tokens.push({ length, token: generated_1.TokenKinds.ModuleIdPart });
                        tokens.push({ length: 1, token: generated_1.TokenKinds.ModuleIdDot });
                    }
                    else
                        tokens.push({ length, token: generated_1.TokenKinds.VariableId });
                }
                return ret.tokensWithLen(tokens);
            };
        }
        const modid = typed_lexer_1.repeat0(conid.concat(".")).concat(conid);
        r.addRule(modid.concat(".").concat(varid), splitAndReturnTokens(p => generated_1.TokenKinds.VariableId));
        r.addRule(modid.concat(".").concat(conid), splitAndReturnTokens(p => generated_1.TokenKinds.ConstructorId));
        r.addRule(modid.concat(".").concat(varOrConSym), splitAndReturnTokens(classifyVarOrConSym));
        r.addSimpleRule(typed_lexer_1.concat("--").concat(typed_lexer_1.repeat0("-"))
            .concat(typed_lexer_1.optional(typed_lexer_1.noneOfChars(ascSymbolChars).concat(typed_lexer_1.repeat0(typed_lexer_1.any))))
            .concat(newline), generated_1.TokenKinds.Comment);
        r.addSimpleRule(/./, generated_1.TokenKinds.Invalid, start);
    }
}
exports.HaskellLexingRules = HaskellLexingRules;
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
function getWsLength(str) {
    let result = 0;
    for (let c of str) {
        if (c === " ")
            result++;
        else if (c === "\n")
            result += 8;
        else
            throw "ws error";
    }
    return result;
}
const tokens = new HaskellLexingRules().lexTokensWithStr(str);
const layoutStack = [0];
for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.token === generated_1.TokenKinds.LetKeyword || t.token === generated_1.TokenKinds.WhereKeyword || t.token === generated_1.TokenKinds.DoKeyword ||
        t.token === generated_1.TokenKinds.OfKeyword) {
        // start of block token
        let lastIndentation = 0;
        let explicitIndentation = false;
        for (let j = i + 1; j < tokens.length; j++) {
            const nextToken = tokens[j].token;
            if (nextToken === generated_1.TokenKinds.Whitespace)
                lastIndentation += getWsLength(tokens[j].str);
            else if (nextToken === generated_1.TokenKinds.NewLine)
                lastIndentation = 0;
            else if (nextToken === generated_1.TokenKinds.OpeningBrace) {
                explicitIndentation = true;
                break;
            }
            else if (nextToken !== generated_1.TokenKinds.Comment)
                break;
        }
        const curIndent = layoutStack[layoutStack.length - 1];
    }
}
class LookaheadLexer {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.stack = [];
    }
    next() {
        const token = this.tokens[this.pos];
        this.pos++;
        return token;
    }
    peek() {
        return this.tokens[this.pos];
    }
    savePosition() {
        this.stack.push(this.pos);
        return this.stack.length;
    }
    forgetSavedPosition(handle) {
        this.stack.pop();
    }
    restoreSavedPosition(handle) {
        this.pos = this.stack.pop();
    }
}
//# sourceMappingURL=parser.js.map