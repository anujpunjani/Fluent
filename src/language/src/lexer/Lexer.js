import Position from "./Position";
import { constants, Token, TokenTypes } from "./Token";
import { illegalCharError } from "../errors";

class Lexer {
  /**
   *
   * @param {string} filename
   * @param {string} filecontent
   */
  constructor(filename, filecontent) {
    this.filename = filename;
    this.filecontent = filecontent;
    this.position = new Position(-1, 0, -1, filename, filecontent);
    this.currentChar = null;
    this.advance();
  }

  advance() {
    this.position.advance(this.currentChar);
    this.currentChar =
      this.position.index < this.filecontent.length
        ? this.filecontent[this.position.index]
        : null;
  }

  generateTokens() {
    let tokens = [];

    while (this.currentChar != null) {
      if (" \t\r".includes(this.currentChar)) {
        this.advance();
      } else if (this.currentChar == "#") {
        this.skipComments();
      } else if (constants.numbers.includes(this.currentChar)) {
        tokens.push(this.makeNumber());
      } else if (constants.letters.includes(this.currentChar)) {
        let identifier = this.makeIdentifier();
        if (
          tokens[tokens.length - 1] &&
          tokens[tokens.length - 1].matches(TokenTypes.KEYWORD, "else") &&
          identifier.matches(TokenTypes.KEYWORD, "if")
        ) {
          tokens[tokens.length - 1] = new Token(
            TokenTypes.KEYWORD,
            "elif",
            tokens[tokens.length - 1].positionStart,
            identifier.positionEnd
          );
        } else tokens.push(identifier);
      } else if (this.currentChar === '"' || this.currentChar === "'") {
        tokens.push(this.makeString());
      } else if ("\n".includes(this.currentChar)) {
        tokens.push(new Token(TokenTypes.NEWLINE, null, this.position));
        this.advance();
      } else if (this.currentChar === "+") {
        tokens.push(new Token(TokenTypes.PLUS, null, this.position));
        this.advance();
      } else if (this.currentChar === "-") {
        tokens.push(new Token(TokenTypes.MINUS, null, this.position));
        this.advance();
      } else if (this.currentChar === "*") {
        this.advance();
        if (this.currentChar === "*") {
          tokens.push(new Token(TokenTypes.POW, null, this.position));
          this.advance();
        } else tokens.push(new Token(TokenTypes.MUL, null, this.position));
      } else if (this.currentChar === "/") {
        tokens.push(new Token(TokenTypes.DIV, null, this.position));
        this.advance();
      } else if (this.currentChar === "%") {
        tokens.push(new Token(TokenTypes.MOD, null, this.position));
        this.advance();
      } else if (this.currentChar === "(") {
        tokens.push(new Token(TokenTypes.LPAREN, null, this.position));
        this.advance();
      } else if (this.currentChar === ")") {
        tokens.push(new Token(TokenTypes.RPAREN, null, this.position));
        this.advance();
      } else if (this.currentChar === "[") {
        tokens.push(new Token(TokenTypes.LSQUARE, null, this.position));
        this.advance();
      } else if (this.currentChar === "]") {
        tokens.push(new Token(TokenTypes.RSQUARE, null, this.position));
        this.advance();
      } else if (this.currentChar === "!") {
        let { token, error } = this.makeNotEquals();
        if (error) return { tokens: null, error: error };
        tokens.push(token);
      } else if (this.currentChar === "=") {
        tokens.push(this.makeEqualsOrArrow());
      } else if (this.currentChar === ",") {
        tokens.push(new Token(TokenTypes.COMMA, null, this.position));
        this.advance();
      } else if (this.currentChar == "<") {
        tokens.push(this.makeLesserThan());
      } else if (this.currentChar == ">") {
        tokens.push(this.makeGreaterThan());
      } else if (this.currentChar === ":") {
        tokens.push(new Token(TokenTypes.COLON, null, this.position));
        this.advance();
      } else if (this.currentChar === ";") {
        tokens.push(new Token(TokenTypes.SEMICOLON, null, this.position));
        this.advance();
      } else if (this.currentChar === "{") {
        tokens.push(new Token(TokenTypes.LBRACE, null, this.position));
        this.advance();
      } else if (this.currentChar === "}") {
        tokens.push(new Token(TokenTypes.RBRACE, null, this.position));
        this.advance();
      } else {
        let positionStart = this.position.copy();
        let char = this.currentChar;
        this.advance();
        return {
          tokens: null,
          error: new illegalCharError(
            positionStart,
            this.position,
            `'${char}'`
          ),
        };
      }
    }

    tokens.push(new Token(TokenTypes.EOF, null, this.position));
    return { tokens: tokens, error: null };
  }

  makeNotEquals() {
    let positionStart = this.position.copy();
    this.advance();

    if (this.currentChar == "=") {
      this.advance();
      return {
        token: new Token(TokenTypes.NE, null, positionStart, this.position),
        error: null,
      };
    }

    this.advance();
    return {
      token: null,
      error: new ExpectedCharError(
        positionStart,
        this.position,
        "'=' (after '!')"
      ),
    };
  }

  makeEqualsOrArrow() {
    let tokenType = TokenTypes.EQ;
    let positionStart = this.position.copy();
    this.advance();

    if (this.currentChar === ">") {
      this.advance();
      tokenType = TokenTypes.ARROW;
    } else if (this.currentChar == "=") {
      this.advance();
      tokenType = TokenTypes.EE;
    }

    return new Token(tokenType, null, positionStart, this.position);
  }

  makeLesserThan() {
    let positionStart = this.position.copy();
    this.advance();

    if (this.currentChar == "=") {
      this.advance();
      return new Token(TokenTypes.LTE, null, positionStart, this.position);
    }

    return new Token(TokenTypes.LT, null, positionStart, this.position);
  }

  makeGreaterThan() {
    let positionStart = this.position.copy();
    this.advance();

    if (this.currentChar == "=") {
      this.advance();
      return new Token(TokenTypes.GTE, null, positionStart, this.position);
    }

    return new Token(TokenTypes.GT, null, positionStart, this.position);
  }

  makeNumber() {
    let num = "";
    let dotCount = 0;
    let positionStart = this.position.copy();
    let digits = constants.numbers + ".";

    while (this.currentChar != null && digits.includes(this.currentChar)) {
      if (this.currentChar == ".") {
        if (dotCount == 1) break;
        dotCount++;
      }

      num += this.currentChar;
      this.advance();
    }

    if (dotCount === 0)
      return new Token("INT", parseInt(num), positionStart, this.position);
    else
      return new Token("FLOAT", parseFloat(num), positionStart, this.position);
  }

  makeString() {
    let string = "";
    let positionStart = this.position.copy();
    let escapeCharacter = false;
    this.advance();

    let escapeCharacters = {
      n: "\n",
      t: "\t",
    };

    while (
      this.currentChar !== null &&
      ((this.currentChar !== '"' && this.currentChar !== "'") ||
        escapeCharacter)
    ) {
      if (escapeCharacter) {
        string += escapeCharacters[this.currentChar];
        escapeCharacter = false;
      } else {
        if (this.currentChar == "\\") escapeCharacter = true;
        else string += this.currentChar;
      }

      this.advance();
    }

    this.advance();
    return new Token(TokenTypes.STRING, string, positionStart, this.position);
  }

  makeIdentifier() {
    let identifer = "";
    let positionStart = this.position.copy();
    let letterNumbers = constants.letters + constants.numbers;

    while (
      this.currentChar != null &&
      letterNumbers.includes(this.currentChar)
    ) {
      identifer += this.currentChar;
      this.advance();
    }

    let TokenType = TokenTypes.KEYWORDS.includes(identifer)
      ? TokenTypes.KEYWORD
      : TokenTypes.IDENTIFIER;
    return new Token(TokenType, identifer, positionStart, this.position);
  }

  skipComments() {
    this.advance();

    while (this.currentChar != null && this.currentChar != "\n") this.advance();

    this.advance();
  }
}

export default Lexer;
