const { Token, TokenTypes } = require("../Lexer/Token");
const { IllegalCharacterError, InvalidSyntaxError } = require("../Errors");
const ParseResult = require("./ParseResult/ParseResult");
const { BinOpNode, NumberNode, UnaryOpNode } = require("./Nodes");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.tokenIndex = -1;
    this.advance();
  }
  parse() {
    let result = this.expr();
    if (!result.error && this.currentToken.type != TokenTypes.EOF) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected +, -, * or / "
        )
      );
    }
    return result;
  }
  advance() {
    this.tokenIndex++;
    if (this.tokenIndex < this.tokens.length)
      this.currentToken = this.tokens[this.tokenIndex];
    return this.currentToken;
  }
  factor() {
    let res = new ParseResult();

    let token = this.currentToken;
    if ([TokenTypes.PLUS, TokenTypes.MINUS].includes(this.currentToken.type)) {
      res.register(this.advance());
      let factor = res.register(this.factor());
      if (res.error) return res;
      return res.success(new UnaryOpNode(token, factor));
    } else if (
      [TokenTypes.INT, TokenTypes.FLOAT].includes(this.currentToken.type)
    ) {
      res.register(this.advance());
      return res.success(new NumberNode(token));
    } else if (this.currentToken.type == TokenTypes.LPAREN) {
      res.register(this.advance());
      let expr = res.register(this.expr());
      if (res.error) return res;
      if (this.currentToken.type == TokenTypes.RPAREN) {
        res.register(this.advance());
        return res.success(expr);
      } else {
        return res.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected )"
          )
        );
      }
    }
    return res.failure(
      new InvalidSyntaxError(
        token.positionStart,
        token.positionEnd,
        "Expected INT or FLOAT"
      )
    );
  }
  term() {
    return this.binaryOperation(this.factor.bind(this), [
      TokenTypes.MUL,
      TokenTypes.DIV,
    ]);
  }

  expr() {
    return this.binaryOperation(this.term.bind(this), [
      TokenTypes.PLUS,
      TokenTypes.MINUS,
    ]);
  }
  binaryOperation(func, ops) {
    let res = new ParseResult();

    let left = res.register(func());
    if (res.error) return res;
    while (ops.includes(this.currentToken.type)) {
      let operationToken = this.currentToken;
      res.register(this.advance());
      let right = res.register(func());
      if (res.error) return res;
      left = new BinOpNode(left, operationToken, right);
    }
    return res.success(left);
  }
}
module.exports = Parser;
