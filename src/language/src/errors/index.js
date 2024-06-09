import Position from "../lexer/Position";
import Context from "../interpreter/Context";
import { stringWithArrows } from "../utils";

class FluentError {
  /**
   *
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @param {string} errorName
   * @param {string} details
   */
  constructor(positionStart, positionEnd, errorName, details) {
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    this.errorName = errorName;
    this.details = details;
  }

  asError() {
    let result = this.errorName + ": " + this.details + "\n";
    result += `File ${this.positionStart.filename}, line ${
      this.positionStart.line + 1
    } \n\n`;
    result += stringWithArrows(
      this.positionStart.filecontent,
      this.positionStart,
      this.positionEnd
    );
    return result;
  }
}
class illegalCharError extends FluentError {
  /**
   *
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @param {string} details
   */
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, "illegal Character", details);
  }
}

class ExpectedCharError extends FluentError {
  /**
   *
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @param {string} details
   */
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, "Expected Character", details);
  }
}
class InvalidSyntaxError extends FluentError {
  /**
   *
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @param {string} details
   */
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, "Invalid Syntax", details);
  }
}
class RuntimeError extends FluentError {
  /**
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @param {string} details
   * @param {Context} context
   */
  constructor(positionStart, positionEnd, details, context) {
    super(positionStart, positionEnd, "Runtime Error", details);
    this.context = context;
  }

  asError() {
    let result = this.generateTraceBack();
    result += `${this.errorName}: ${this.details}\n\n`;
    result += stringWithArrows(
      this.positionStart.filecontent,
      this.positionStart,
      this.positionEnd
    );
    return result;
  }

  generateTraceBack() {
    let result = "";
    let position = this.positionStart;
    let context = this.context;

    while (context) {
      result = ` File ${position.filename}, line ${position.line + 1}, in ${
        context.displayName
      }\n${result}`;
      position = context.parentEntryPosition;
      context = context.parent;
    }
    return "Traceback (most recent call last):\n" + result;
  }
}

export { FluentError, InvalidSyntaxError, RuntimeError, illegalCharError };
