"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenKinds;
(function (TokenKinds) {
    TokenKinds[TokenKinds["Invalid"] = 0] = "Invalid";
    TokenKinds[TokenKinds["Integer"] = 1] = "Integer";
    TokenKinds[TokenKinds["Float"] = 2] = "Float";
    TokenKinds[TokenKinds["Char"] = 3] = "Char";
    TokenKinds[TokenKinds["String"] = 4] = "String";
    TokenKinds[TokenKinds["NewLine"] = 5] = "NewLine";
    TokenKinds[TokenKinds["Whitespace"] = 6] = "Whitespace";
    TokenKinds[TokenKinds["Comment"] = 7] = "Comment";
    TokenKinds[TokenKinds["SingleLineComment"] = 8] = "SingleLineComment";
    TokenKinds[TokenKinds["MultiLineComment"] = 9] = "MultiLineComment";
    TokenKinds[TokenKinds["VariableId"] = 10] = "VariableId";
    TokenKinds[TokenKinds["ConstructorId"] = 11] = "ConstructorId";
    TokenKinds[TokenKinds["VariableSymbol"] = 12] = "VariableSymbol";
    TokenKinds[TokenKinds["ConstructorSymbol"] = 13] = "ConstructorSymbol";
    TokenKinds[TokenKinds["ModuleIdPart"] = 14] = "ModuleIdPart";
    TokenKinds[TokenKinds["ModuleIdDot"] = 15] = "ModuleIdDot";
    TokenKinds[TokenKinds["CaseKeyword"] = 16] = "CaseKeyword";
    TokenKinds[TokenKinds["ClassKeyword"] = 17] = "ClassKeyword";
    TokenKinds[TokenKinds["DataKeyword"] = 18] = "DataKeyword";
    TokenKinds[TokenKinds["DefaultKeyword"] = 19] = "DefaultKeyword";
    TokenKinds[TokenKinds["DerivingKeyword"] = 20] = "DerivingKeyword";
    TokenKinds[TokenKinds["DoKeyword"] = 21] = "DoKeyword";
    TokenKinds[TokenKinds["ElseKeyword"] = 22] = "ElseKeyword";
    TokenKinds[TokenKinds["ForeignKeyword"] = 23] = "ForeignKeyword";
    TokenKinds[TokenKinds["IfKeyword"] = 24] = "IfKeyword";
    TokenKinds[TokenKinds["ImportKeyword"] = 25] = "ImportKeyword";
    TokenKinds[TokenKinds["InKeyword"] = 26] = "InKeyword";
    TokenKinds[TokenKinds["InfixKeyword"] = 27] = "InfixKeyword";
    TokenKinds[TokenKinds["InfixlKeyword"] = 28] = "InfixlKeyword";
    TokenKinds[TokenKinds["InfixrKeyword"] = 29] = "InfixrKeyword";
    TokenKinds[TokenKinds["InstanceKeyword"] = 30] = "InstanceKeyword";
    TokenKinds[TokenKinds["LetKeyword"] = 31] = "LetKeyword";
    TokenKinds[TokenKinds["ModuleKeyword"] = 32] = "ModuleKeyword";
    TokenKinds[TokenKinds["NewtypeKeyword"] = 33] = "NewtypeKeyword";
    TokenKinds[TokenKinds["OfKeyword"] = 34] = "OfKeyword";
    TokenKinds[TokenKinds["ThenKeyword"] = 35] = "ThenKeyword";
    TokenKinds[TokenKinds["TypeKeyword"] = 36] = "TypeKeyword";
    TokenKinds[TokenKinds["WhereKeyword"] = 37] = "WhereKeyword";
    TokenKinds[TokenKinds["Underscore"] = 38] = "Underscore";
    TokenKinds[TokenKinds["DotDot"] = 39] = "DotDot";
    TokenKinds[TokenKinds["Colon"] = 40] = "Colon";
    TokenKinds[TokenKinds["DoubleColon"] = 41] = "DoubleColon";
    TokenKinds[TokenKinds["Equals"] = 42] = "Equals";
    TokenKinds[TokenKinds["Backslash"] = 43] = "Backslash";
    TokenKinds[TokenKinds["Bar"] = 44] = "Bar";
    TokenKinds[TokenKinds["ThinArrowLeft"] = 45] = "ThinArrowLeft";
    TokenKinds[TokenKinds["ThinArrowRight"] = 46] = "ThinArrowRight";
    TokenKinds[TokenKinds["AtSign"] = 47] = "AtSign";
    TokenKinds[TokenKinds["Tilde"] = 48] = "Tilde";
    TokenKinds[TokenKinds["FatArrowRight"] = 49] = "FatArrowRight";
    TokenKinds[TokenKinds["OpeningParen"] = 50] = "OpeningParen";
    TokenKinds[TokenKinds["ClosingParen"] = 51] = "ClosingParen";
    TokenKinds[TokenKinds["Comma"] = 52] = "Comma";
    TokenKinds[TokenKinds["Semicolon"] = 53] = "Semicolon";
    TokenKinds[TokenKinds["OpeningBracket"] = 54] = "OpeningBracket";
    TokenKinds[TokenKinds["ClosingBracket"] = 55] = "ClosingBracket";
    TokenKinds[TokenKinds["Backtick"] = 56] = "Backtick";
    TokenKinds[TokenKinds["OpeningBrace"] = 57] = "OpeningBrace";
    TokenKinds[TokenKinds["ClosingBrace"] = 58] = "ClosingBrace";
})(TokenKinds = exports.TokenKinds || (exports.TokenKinds = {}));
exports.reservedIds = {
    "case": "CaseKeyword",
    "class": "ClassKeyword",
    "data": "DataKeyword",
    "default": "DefaultKeyword",
    "deriving": "DerivingKeyword",
    "do": "DoKeyword",
    "else": "ElseKeyword",
    "foreign": "ForeignKeyword",
    "if": "IfKeyword",
    "import": "ImportKeyword",
    "in": "InKeyword",
    "infix": "InfixKeyword",
    "infixl": "InfixlKeyword",
    "infixr": "InfixrKeyword",
    "instance": "InstanceKeyword",
    "let": "LetKeyword",
    "module": "ModuleKeyword",
    "newtype": "NewtypeKeyword",
    "of": "OfKeyword",
    "then": "ThenKeyword",
    "type": "TypeKeyword",
    "where": "WhereKeyword",
    "_": "Underscore"
};
exports.reservedOps = {
    "..": "DotDot",
    ":": "Colon",
    "::": "DoubleColon",
    "=": "Equals",
    "\\": "Backslash",
    "|": "Bar",
    "<-": "ThinArrowLeft",
    "->": "ThinArrowRight",
    "@": "AtSign",
    "~": "Tilde",
    "=>": "FatArrowRight"
};
exports.specialTokens = {
    "(": "OpeningParen",
    ")": "ClosingParen",
    ",": "Comma",
    ";": "Semicolon",
    "[": "OpeningBracket",
    "]": "ClosingBracket",
    "`": "Backtick",
    "{": "OpeningBrace",
    "}": "ClosingBrace"
};
//# sourceMappingURL=generated.js.map