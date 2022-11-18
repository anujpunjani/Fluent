const { RunTimeError } = require("../Errors");

class Number {
  constructor(value) {
    this.value = value;
    this.positionStart = null;
    this.positionEnd = null;
    this.setPosition();
    this.setContext();
  }

  setPosition(positionStart = null, positionEnd = null) {
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    return this;
  }

  setContext(context = null) {
    this.context = context;
    return this;
  }

  addedTo(other) {
    if (other instanceof Number) {
      return {
        result: new Number(this.value + other.value).setContext(this.context),
        error: null,
      };
    }
  }

  subbedBy(other) {
    if (other instanceof Number) {
      return {
        result: new Number(this.value - other.value).setContext(this.context),
        error: null,
      };
    }
  }

  multedBy(other) {
    if (other instanceof Number) {
      return {
        result: new Number(this.value * other.value).setContext(this.context),
        error: null,
      };
    }
  }

  divedBy(other) {
    if (other instanceof Number) {
      if (other.value == 0) {
        return {
          result: null,
          error: new RunTimeError(
            other.positionStart,
            other.positionEnd,
            "Division by zero",
            this.context
          ),
        };
      }
      return {
        result: new Number(this.value / other.value).setContext(this.context),
        error: null,
      };
    }
  }

  toString() {
    return `${this.value}`;
  }
}

module.exports = Number;
