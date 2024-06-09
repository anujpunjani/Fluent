import { Token, TokenTypes } from "../lexer/Token";
import { InvalidSyntaxError } from "../errors";
import ParseResult from "./ParseResult";

import {
  BinOpNode,
  NumberNode,
  UnaryOpNode,
  VarAssignNode,
  VarAccessNode,
  CallNode,
  FuncDefNode,
  StringNode,
  ListNode,
  ReturnNode,
  ContinueNode,
  BreakNode,
  IfNode,
  ForNode,
  WhileNode,
  IndexAccessNode,
  PassNode,
} from "./nodes";

class Parser {
  /**
   *
   * @param {Token[]} tokens
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.tokenIndex = -1;
    this.advance();
  }

  getLastFunctionCall() {
    const error = new Error("Traceback capture");
    const stack = error.stack.split("\n");
    // Extract the second and third items in the stack, which represent the last two function calls
    // stack[0] is the "Error" message itself
    return stack.length > 2
      ? `${stack[3] ? stack[3].trim() : ""}`
      : "Not enough function calls found";
  }

  advance() {
    this.tokenIndex++;
    this.updateCurrentToken();
    //console.log(this.currentToken + " " + this.getLastFunctionCall());
    return this.currentToken;
  }

  reverse(amount = 1) {
    this.tokenIndex -= amount;
    this.updateCurrentToken();
    return this.currentToken;
  }

  updateCurrentToken() {
    if (this.tokenIndex >= 0 && this.tokenIndex < this.tokens.length)
      this.currentToken = this.tokens[this.tokenIndex];
  }

  /**
   * @returns {ParseResult}
   */
  parse() {
    let response = this.statements();
    if (!response.error && this.currentToken.type != TokenTypes.EOF) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          // "Expected ';', '+', '-', '*', '/', '**', '==', '!=', '<', '>', '<=', '>=', 'and', or 'or'"
          "Expected ';', '\"', ''', '+', '-', '*', '/', '**'"
        )
      );
    }

    return response;
  }

  // ================================================================================

  statements() {
    let response = new ParseResult();
    let statements = [];
    let positionStart = this.currentToken.positionStart.copy();

    response.register(this.continueIfNewLine());

    let statement = response.register(this.statement());
    if (response.error) return response;
    statements.push(statement);

    let moreStatements = true;
    while (true) {
      let newlineCount = 0;

      while (
        this.currentToken.type === TokenTypes.NEWLINE ||
        this.currentToken.type === TokenTypes.SEMICOLON
      ) {
        response.registerAdvancement();
        this.advance();
        if (this.currentToken.type === TokenTypes.NEWLINE) newlineCount++;
      }

      if (newlineCount == 0 && this.currentToken.type === TokenTypes.EOF) {
        // if there is no new line and the token is EOF
        // also can add check for RBRACE
        moreStatements = false;
      }

      if (!moreStatements) break;
      statement = response.tryRegister(this.statement());

      if (!statement) {
        this.reverse(response.toReverseCount);
        moreStatements = false;
        continue;
      }
      statements.push(statement);
    }

    return response.success(
      statements.length == 1
        ? statements[0]
        : new ListNode(
            statements,
            positionStart,
            this.currentToken.positionEnd.copy()
          )
    );
  }

  statement() {
    let response = new ParseResult();
    let positionStart = this.currentToken.positionStart.copy();

    if (this.currentToken.matches(TokenTypes.KEYWORD, "return")) {
      response.registerAdvancement();
      this.advance();

      let expr = response.tryRegister(this.expr());
      if (!expr) return this.reverse(response.toReverseCount);

      if (this.currentToken.type !== TokenTypes.SEMICOLON) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ';'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();

      return response.success(
        new ReturnNode(
          expr,
          positionStart,
          this.currentToken.positionStart.copy()
        )
      );
    }

    if (this.currentToken.matches(TokenTypes.KEYWORD, "continue")) {
      response.registerAdvancement();
      this.advance();

      if (this.currentToken.type !== TokenTypes.SEMICOLON) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ';'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();

      return response.success(
        new ContinueNode(positionStart, this.currentToken.positionStart.copy())
      );
    }

    if (this.currentToken.matches(TokenTypes.KEYWORD, "break")) {
      response.registerAdvancement();
      this.advance();

      if (this.currentToken.type !== TokenTypes.SEMICOLON) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ';'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();

      return response.success(
        new BreakNode(positionStart, this.currentToken.positionStart.copy())
      );
    }

    if (this.currentToken.matches(TokenTypes.KEYWORD, "pass")) {
      response.registerAdvancement();
      this.advance();

      if (this.currentToken.type !== TokenTypes.SEMICOLON) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ';'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();

      return response.success(
        new PassNode(positionStart, this.currentToken.positionStart.copy())
      );
    }

    let expr = response.register(this.expr());
    if (response.error) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'pass', 'continue', 'break', 'return', 'if', 'for', 'while', 'func',  int, float, identifier, '+', '-', '(', '[' or 'not'"
        )
      );
    }

    if (
      !["IfNode", "FuncDefNode", "ForNode", "WhileNode"].includes(expr.name) &&
      !(expr.name === "VarAssignNode" && expr.valueNode.name === "FuncDefNode")
    ) {
      if (this.currentToken.type !== TokenTypes.SEMICOLON) {
        this.reverse();
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ';'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();
    }
    return response.success(expr);
  }

  /**
   * @returns {ParseResult}
   */
  expr() {
    let response = new ParseResult();

    if (this.currentToken.type === TokenTypes.IDENTIFIER) {
      let varName = this.currentToken;
      response.registerAdvancement();
      this.advance();

      if (this.currentToken.type === TokenTypes.EQ) {
        response.registerAdvancement();
        this.advance();

        let expr = response.register(this.expr());
        if (response.error) return response;
        return response.success(new VarAssignNode(varName, expr));
      } else {
        this.reverse();
      }
    }

    let node = response.register(
      this.binaryOperation(this.compExpr.bind(this), [
        TokenTypes.KEYWORD + "and",
        TokenTypes.KEYWORD + "or",
      ])
    );
    if (response.error)
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'if', 'for', 'while', 'func',  int, float, identifier, '+', '-', '(', '[' or 'not'"
        )
      );
    return response.success(node);
  }

  compExpr() {
    let response = new ParseResult();

    if (this.currentToken.matches(TokenTypes.KEYWORD, "not")) {
      let operatorToken = this.currentToken;
      response.registerAdvancement();
      this.advance();
      let node = response.register(this.compExpr());
      if (response.error) return response;
      return response.success(new UnaryOpNode(operatorToken, node));
    }

    let node = response.register(
      this.binaryOperation(this.arithExpr.bind(this), [
        TokenTypes.EE,
        TokenTypes.NE,
        TokenTypes.LT,
        TokenTypes.GT,
        TokenTypes.LTE,
        TokenTypes.GTE,
      ])
    );
    if (response.error) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected int, float, identifier, '+', '-', '(', '[' or 'not'"
        )
      );
    }
    return response.success(node);
  }

  arithExpr() {
    return this.binaryOperation(this.term.bind(this), [
      TokenTypes.PLUS,
      TokenTypes.MINUS,
    ]);
  }

  /**
   * @returns {ParseResult}
   */
  term() {
    return this.binaryOperation(this.factor.bind(this), [
      TokenTypes.MUL,
      TokenTypes.DIV,
    ]);
  }

  /**
   * @returns {ParseResult}
   */
  factor() {
    let response = new ParseResult();
    let token = this.currentToken;

    if ([TokenTypes.PLUS, TokenTypes.MINUS].includes(this.currentToken.type)) {
      response.registerAdvancement();
      this.advance();
      let factor = response.register(this.factor());
      if (response.error) return response;
      return response.success(new UnaryOpNode(token, factor));
    }
    return this.power();
  }

  /**
   * @returns {ParseResult}
   */
  power() {
    return this.binaryOperation(
      this.call.bind(this),
      [TokenTypes.POW, TokenTypes.MOD],
      this.factor.bind(this)
    );
  }

  call() {
    let response = new ParseResult();
    let atom = response.register(this.atom());
    if (response.error) return response;

    if (this.currentToken.type == TokenTypes.LPAREN) {
      response.registerAdvancement();
      this.advance();
      let argNodes = [];

      if (this.currentToken.type == TokenTypes.RPAREN) {
        response.registerAdvancement();
        this.advance();
      } else {
        argNodes.push(response.register(this.expr()));
        if (response.error) {
          return response.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ')', 'var', 'if', 'for', 'while', 'func', int, float, identifier, '+', '-', '(', '[' or 'not'"
            )
          );
        }

        while (this.currentToken.type == TokenTypes.COMMA) {
          response.registerAdvancement();
          this.advance();

          argNodes.push(response.register(this.expr()));
          if (response.error) return response;
        }

        if (this.currentToken.type != TokenTypes.RPAREN) {
          return response.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ',' or ')'"
            )
          );
        }

        response.registerAdvancement();
        this.advance();
      }
      return response.success(new CallNode(atom, argNodes));
    }

    return response.success(atom);
  }

  /**
   * @returns {ParseResult}
   */
  atom() {
    let response = new ParseResult();
    let token = this.currentToken;

    if ([TokenTypes.INT, TokenTypes.FLOAT].includes(this.currentToken.type)) {
      response.registerAdvancement();
      this.advance();
      return response.success(new NumberNode(token));
    } else if (this.currentToken.type == TokenTypes.STRING) {
      response.registerAdvancement();
      this.advance();
      return response.success(new StringNode(token));
    } else if (this.currentToken.type == TokenTypes.IDENTIFIER) {
      response.registerAdvancement();
      this.advance();
      let accessNode = new VarAccessNode(token);
      // Index element access for String or List
      while (this.currentToken.type === TokenTypes.LSQUARE) {
        response.registerAdvancement();
        this.advance();
        let expr = response.register(this.expr());
        if (response.error) return response;
        if (this.currentToken.type == TokenTypes.RSQUARE) {
          response.registerAdvancement();
          this.advance();
          accessNode = new IndexAccessNode(
            accessNode,
            expr,
            token.positionStart,
            this.currentToken.positionEnd
          );
        } else {
          return response.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ']'"
            )
          );
        }
      }
      return response.success(accessNode);
    } else if (this.currentToken.type == TokenTypes.LPAREN) {
      response.registerAdvancement();
      this.advance();
      let expr = response.register(this.expr());
      if (response.error) return response;
      if (this.currentToken.type == TokenTypes.RPAREN) {
        response.registerAdvancement();
        this.advance();
        return response.success(expr);
      } else {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ')'"
          )
        );
      }
    } else if (this.currentToken.type == TokenTypes.LSQUARE) {
      let listExpr = response.register(this.listExpr());
      if (response.error) return response;
      return response.success(listExpr);
    } else if (this.currentToken.matches(TokenTypes.KEYWORD, "if")) {
      let ifExpr = response.register(this.ifExpr());
      if (response.error) return response;
      return response.success(ifExpr);
    } else if (this.currentToken.matches(TokenTypes.KEYWORD, "for")) {
      let forExpr = response.register(this.forExpr());
      if (response.error) return response;
      return response.success(forExpr);
    } else if (this.currentToken.matches(TokenTypes.KEYWORD, "while")) {
      let whileExpr = response.register(this.whileExpr());
      if (response.error) return response;
      return response.success(whileExpr);
    } else if (this.currentToken.matches(TokenTypes.KEYWORD, "func")) {
      let funcDef = response.register(this.funcDef());
      if (response.error) return response;
      return response.success(funcDef);
    }

    return response.failure(
      new InvalidSyntaxError(
        this.currentToken.positionStart,
        this.currentToken.positionEnd,
        "Expected int, float, string, identifier, '+', '-', '(', '[', 'if', 'for', 'while', 'func'"
      )
    );
  }

  continueIfNewLine() {
    let response = new ParseResult();
    if (this.currentToken.type === TokenTypes.NEWLINE) {
      response.registerAdvancement();
      this.advance();

      while (this.currentToken.type === TokenTypes.NEWLINE) {
        response.registerAdvancement();
        this.advance();
      }

      return response.success(null);
    }
    return response.success(null);
  }

  ifExpr() {
    let response = new ParseResult();
    let allCases = response.register(this.ifExprCases("if"));
    if (response.error) return response;
    let { cases, elseCase } = allCases;
    return response.success(new IfNode(cases, elseCase));
  }

  ifExprB() {
    return this.ifExprCases("elif");
  }

  ifExprC() {
    let response = new ParseResult();
    let elseCase = null;

    if (this.currentToken.matches(TokenTypes.KEYWORD, "else")) {
      response.registerAdvancement();
      this.advance();

      response.register(this.continueIfNewLine());

      if (this.currentToken.type != TokenTypes.LBRACE) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected '{'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();

      // if (this.currentToken.type == TokenTypes.NEWLINE) {
      response.register(this.continueIfNewLine());

      let statements = response.register(this.statements());
      if (response.error) return response;
      elseCase = [statements, true];

      response.register(this.continueIfNewLine());

      if (this.currentToken.type != TokenTypes.RBRACE) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            `Expected '}'`
          )
        );
      }

      response.registerAdvancement();
      this.advance();
      // } else {
      // 	let expr = response.register(this.statement());
      // 	if (response.error) return response;

      // 	elseCase = [expr, false];

      // 	response.register(this.continueIfNewLine());

      // 	if (this.currentToken.type != TokenTypes.RBRACE) {
      // 		return response.failure(
      // 			new InvalidSyntaxError(
      // 				this.currentToken.positionStart,
      // 				this.currentToken.positionEnd,
      // 				"Expected '}'"
      // 			)
      // 		);
      // 	}

      // 	response.registerAdvancement();
      // 	this.advance();
      // }
    }

    return response.success(elseCase);
  }

  ifExprBorC() {
    let response = new ParseResult();
    let cases = [];
    let elseCase = null;

    if (this.currentToken.matches(TokenTypes.KEYWORD, "elif")) {
      let allCases = response.register(this.ifExprB());
      if (response.error) return response;
      cases = allCases.cases;
      elseCase = allCases.elseCase;
    } else {
      let allCases = response.register(this.ifExprC());
      if (response.error) return response;
      elseCase = allCases;
    }

    return response.success({ cases: cases, elseCase: elseCase });
  }

  ifExprCases(caseKeyword) {
    let response = new ParseResult();
    let cases = [];
    let elseCase = null;

    if (!this.currentToken.matches(TokenTypes.KEYWORD, caseKeyword)) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected '${caseKeyword}'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    let condition = response.register(this.expr());
    if (response.error) return response;

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.LBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '{'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    // if (this.currentToken.type == TokenTypes.NEWLINE) {
    response.register(this.continueIfNewLine());

    let statements = response.register(this.statements());
    if (response.error) return response;
    cases.push([condition, statements, true]);

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.RBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected '}'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    response.register(this.continueIfNewLine());

    if (
      this.currentToken.matches(TokenTypes.KEYWORD, "elif") ||
      this.currentToken.matches(TokenTypes.KEYWORD, "else")
    ) {
      let allCases = response.register(this.ifExprBorC());
      if (response.error) return response;
      cases = [...cases, ...allCases.cases];
      elseCase = allCases.elseCase;
    }
    // } else {
    // 	let expr = response.register(this.statement());
    // 	if (response.error) return response;
    // 	cases.push([condition, expr, false]);

    // 	response.register(this.continueIfNewLine());

    // 	if (this.currentToken.type != TokenTypes.RBRACE) {
    // 		return response.failure(
    // 			new InvalidSyntaxError(
    // 				this.currentToken.positionStart,
    // 				this.currentToken.positionEnd,
    // 				"Expected '}'"
    // 			)
    // 		);
    // 	}

    // 	response.registerAdvancement();
    // 	this.advance();

    // 	response.register(this.continueIfNewLine());

    // 	if (
    // 		this.currentToken.matches(TokenTypes.KEYWORD, "elif") ||
    // 		this.currentToken.matches(TokenTypes.KEYWORD, "else")
    // 	) {
    // 		let allCases = response.register(this.ifExprBorC());
    // 		if (response.error) return response;
    // 		cases = [...cases, ...allCases.cases];
    // 		elseCase = allCases.elseCase;
    // 	}
    // }

    return response.success({ cases, elseCase });
  }

  forExpr() {
    let response = new ParseResult();
    let varName, startValue, endValue, stepValue, body;

    if (!this.currentToken.matches(TokenTypes.KEYWORD, "for")) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'for'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    if (this.currentToken.type != TokenTypes.IDENTIFIER) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected identifier"
        )
      );
    }

    varName = this.currentToken;
    response.registerAdvancement();
    this.advance();

    if (this.currentToken.type != TokenTypes.EQ) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '='"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    startValue = response.register(this.expr());
    if (response.error) return response;

    if (!this.currentToken.matches(TokenTypes.KEYWORD, "until")) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'until'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    endValue = response.register(this.expr());
    if (response.error) return response;

    if (this.currentToken.matches(TokenTypes.KEYWORD, "step")) {
      response.registerAdvancement();
      this.advance();

      stepValue = response.register(this.expr());
      if (response.error) return response;
    }

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.LBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '{'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    // if (this.currentToken.type == TokenTypes.NEWLINE) {
    response.register(this.continueIfNewLine());

    body = response.register(this.statements());
    if (response.error) return response;

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.RBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '}'"
        )
      );
    }
    response.registerAdvancement();
    this.advance();

    return response.success(
      new ForNode(varName, startValue, endValue, stepValue, body, true)
    );
    // }

    // body = response.register(this.statement());
    // if (response.error) return response;

    // response.register(this.continueIfNewLine());

    // if (this.currentToken.type != TokenTypes.RBRACE) {
    // 	return response.failure(
    // 		new InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected '}'")
    // 	);
    // }

    // response.registerAdvancement();
    // this.advance();

    // return response.success(new ForNode(varName, startValue, endValue, stepValue, body, false));
  }

  whileExpr() {
    let response = new ParseResult();
    let condition, body;

    if (!this.currentToken.matches(TokenTypes.KEYWORD, "while")) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'while'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    condition = response.register(this.expr());
    if (response.error) return response;

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.LBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '{'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    // if (this.currentToken.type == TokenTypes.NEWLINE) {
    response.register(this.continueIfNewLine());

    body = response.register(this.statements());
    if (response.error) return response;

    if (this.currentToken.type != TokenTypes.RBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '}'"
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    return response.success(new WhileNode(condition, body, true));
    // }

    // body = response.register(this.statement());
    // if (response.error) return response;

    // response.register(this.continueIfNewLine());

    // if (this.currentToken.type != TokenTypes.RBRACE) {
    // 	return response.failure(
    // 		new InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected '}'")
    // 	);
    // }

    // response.registerAdvancement();
    // this.advance();

    // return response.success(new WhileNode(condition, body, false));
  }

  listExpr() {
    let response = new ParseResult();
    let elementNodes = [];
    let positionStart = this.currentToken.positionStart.copy();

    if (this.currentToken.type != TokenTypes.LSQUARE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '['"
        )
      );
    }

    response.registerAdvancement();
    this.advance();
    response.register(this.continueIfNewLine());

    if (this.currentToken.type == TokenTypes.RSQUARE) {
      response.registerAdvancement();
      this.advance();
    } else {
      elementNodes.push(response.register(this.expr()));
      if (response.error) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ']', 'var', 'if', 'for', 'while', 'func', int, float, identifier, '+', '-', '(', '[' or 'not'"
          )
        );
      }

      while (this.currentToken.type == TokenTypes.COMMA) {
        response.registerAdvancement();
        this.advance();
        response.register(this.continueIfNewLine());

        elementNodes.push(response.register(this.expr()));
        if (response.error) return response;
      }
      response.register(this.continueIfNewLine());

      if (this.currentToken.type != TokenTypes.RSQUARE) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ',' or ']'"
          )
        );
      }

      response.registerAdvancement();
      this.advance();
    }

    return response.success(
      new ListNode(
        elementNodes,
        positionStart,
        this.currentToken.positionEnd.copy()
      )
    );
  }

  funcDef() {
    let response = new ParseResult();
    let funcName = null;

    if (!this.currentToken.matches(TokenTypes.KEYWORD, "func")) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected 'func'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    if (this.currentToken.type == TokenTypes.IDENTIFIER) {
      funcName = this.currentToken;
      response.registerAdvancement();
      this.advance();

      if (this.currentToken.type != TokenTypes.LPAREN) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            `Expected '('`
          )
        );
      }
    } else {
      if (this.currentToken.type != TokenTypes.LPAREN) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            `Expected identifier or '('`
          )
        );
      }
    }

    let argNames = [];
    response.registerAdvancement();
    this.advance();

    if (this.currentToken.type == TokenTypes.IDENTIFIER) {
      argNames.push(this.currentToken);
      response.registerAdvancement();
      this.advance();

      while (this.currentToken.type == TokenTypes.COMMA) {
        response.registerAdvancement();
        this.advance();

        if (this.currentToken.type != TokenTypes.IDENTIFIER) {
          return response.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              `Expected identifier`
            )
          );
        }

        argNames.push(this.currentToken);
        response.registerAdvancement();
        this.advance();
      }

      if (this.currentToken.type != TokenTypes.RPAREN) {
        return response.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            `Expected ',' or ')'`
          )
        );
      }
    } else if (this.currentToken.type != TokenTypes.RPAREN) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected identifier or ')'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    if (this.currentToken.type == TokenTypes.ARROW) {
      response.registerAdvancement();
      this.advance();

      let NodeToReturn = response.register(this.expr());
      if (response.error) return response;

      return response.success(
        new FuncDefNode(funcName, argNames, NodeToReturn, true)
      );
    }
    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.LBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected '{'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    let body = response.register(this.statements());
    if (response.error) return response;

    response.register(this.continueIfNewLine());

    if (this.currentToken.type != TokenTypes.RBRACE) {
      return response.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          `Expected '}'`
        )
      );
    }

    response.registerAdvancement();
    this.advance();

    return response.success(new FuncDefNode(funcName, argNames, body, false));
  }

  // ================================================================================

  /**
   * @param {Function} functionA
   * @param {string[]} operations
   * @param {Function} functionB
   * @returns {ParseResult}
   */
  binaryOperation(functionA, operations, functionB = null) {
    if (functionB == null) functionB = functionA;

    let response = new ParseResult();
    let left = response.register(functionA());
    if (response.error) return response;

    while (
      operations.includes(this.currentToken.type) ||
      operations.includes(this.currentToken.type + this.currentToken.value)
    ) {
      let operatorToken = this.currentToken;
      response.registerAdvancement();
      this.advance();
      let right = response.register(functionB());
      if (response.error) return response;
      left = new BinOpNode(left, operatorToken, right);
    }

    return response.success(left);
  }
}

export default Parser;
