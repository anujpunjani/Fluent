const { IllegalCharacterError } = require("../Errors");
const Position = require("./Position");
const { Token, TokenTypes, Constants } = require("./Token");

class Lexer {
  constructor(filename, filecontent) {
    this.filename = filename;
    this.filecontent = filecontent;
    this.position = new Position(-1, 0, -1, filename, filecontent);
    this.currentChar = null;
    this.advance();
  }

  advance() {
    //!Reading character of file content one by one ...
    // this.position += 1;
    this.position.advance(this.currentChar);
    this.currentChar =
      this.position.index < this.filecontent.length
        ? this.filecontent[this.position.index]
        : null; // if it reaches last gives null
  }

  generateTokens() {
    let tokens = [];

    while (this.currentChar != null) {
      if (" \r\t".includes(this.currentChar)) {
        //char at -> space , tab , r == repeat that string from 0 index
        this.advance();
      } else if (Constants.numbers.includes(this.currentChar)) {
        tokens.push(this.makeNumber());
      } else if (this.currentChar == "+") {
        tokens.push(new Token(TokenTypes.PLUS, this.positionStart));
        this.advance();
      } else if (this.currentChar == "-") {
        tokens.push(new Token(TokenTypes.MINUS, this.positionStart));
        this.advance();
      } else if (this.currentChar == "*") {
        tokens.push(new Token(TokenTypes.MUL, this.positionStart));
        this.advance();
      } else if (this.currentChar == "/") {
        tokens.push(new Token(TokenTypes.DIV, this.positionStart));
        this.advance();
      } else if (this.currentChar == "(") {
        tokens.push(new Token(TokenTypes.LPAREN, this.positionStart));
        this.advance();
      } else if (this.currentChar == ")") {
        tokens.push(new Token(TokenTypes.RPAREN, this.positionStart));
        this.advance();
      } else {
        let character = this.currentChar;
        this.advance();
        let positionStart = this.position.copy();
        return {
          tokens: null, //Tokens not found , throw error
          errors: new IllegalCharacterError(
            positionStart,
            this.position,
            "'" + character + "'"
          ),
        };
      }
    }
    tokens.push(new Token(TokenTypes.EOF, null, this.position));
    return { tokens: tokens, errors: null }; //error not found return token
  }

  makeNumber() {
    let num = "";
    let dotCount = 0;
    let positionStart = this.position.copy();

    let digits = Constants.numbers + "."; //for float values and decimals ...
    while (this.currentChar != null && digits.includes(this.currentChar)) {
      if (this.currentChar === ".") {
        if (dotCount === 1) break; //? put error insteatd of break
        dotCount++;
      }
      num += this.currentChar;

      this.advance();
    }

    if (dotCount === 0) {
      return new Token(
        TokenTypes.INT,
        parseInt(num),
        positionStart,
        this.position
      );
    } else {
      return new Token(
        TokenTypes.FLOAT,
        parseFloat(num),
        positionStart,
        this.position
      );
    }
  }
}

module.exports = Lexer;
