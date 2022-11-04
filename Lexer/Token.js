const Constants = Object.freeze({
  numbers: "0123456789",
  letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
});

const TokenTypes = Object.freeze({
  //!cannot change any vlaues of these object due to freeze
  INT: "INT",
  FLOAT: "FLOAT",
  STRING: "STRING",
  IDENTIFIER: "IDENTIFIER", //variables
  KEYWORD: "KEYWORD",
  //MATH OPERATORS
  PLUS: "PLUS",
  MINUS: "MINUS",
  MUL: "MUL",
  DIV: "DIV",
  MOD: "MOD",
  //COMPARISON OPERATORS
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  LBRACE: "LBRACE",
  RBRACE: "RBRACE",
  LBRACKET: "LBRACKET",
  RBRACKET: "RBRACKET",
  //? COMMA: "COMMA",
  EOF: "EOF",
  //KEYWORDS
  KEYWORDS: ["var", "let"],

  //?COMPARISON OPERATORS
});

class Token {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
  }

  //printing token by converting to string

  toString() {
    if (!this.value) return `${this.type}`; //+,-,....
    return `${this.type}:${this.value}`;
  }
}

module.exports = { Token, TokenTypes, Constants };
