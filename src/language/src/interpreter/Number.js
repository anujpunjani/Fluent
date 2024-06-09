import { RuntimeError } from "../errors";
import Value from "./Value";

class Number extends Value {
  static null = new Number(0);
  static false = new Number(0);
  static true = new Number(1);

  /**
   * @param {Number} value
   */
  constructor(value) {
    super();
    this.value = value;
    this.name = "Number";
  }

  addedTo(other) {
    if (other.name == "Number")
      return {
        result: new Number(this.value + other.value).setContext(this.context),
        error: null,
      };
    else return this.illegalOperation(this, other);
  }

  subbedBy(other) {
    if (other.name == "Number")
      return {
        result: new Number(this.value - other.value).setContext(this.context),
        error: null,
      };
    else return this.illegalOperation(this, other);
  }

  multedBy(other) {
    if (other.name == "Number")
      return {
        result: new Number(this.value * other.value).setContext(this.context),
        error: null,
      };
    else return this.illegalOperation(this, other);
  }

  diviedBy(other) {
    if (other.name == "Number") {
      if (other.value == 0) {
        return {
          result: null,
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Division by zero",
            this.context
          ),
        };
      }
      return {
        result: new Number(this.value / other.value).setContext(this.context),
        error: null,
      };
    } else return this.illegalOperation(this, other);
  }

  powerdBy(other) {
    if (other.name == "Number")
      return {
        result: new Number(this.value ** other.value).setContext(this.context),
        error: null,
      };
    else return this.illegalOperation(this, other);
  }

  moddedBy(other) {
    if (other.name == "Number") {
      if (other.value == 0) {
        return {
          result: null,
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Modulo by zero",
            this.context
          ),
        };
      }
      return {
        result: new Number(this.value % other.value).setContext(this.context),
        error: null,
      };
    } else return this.illegalOperation(this, other);
  }

  getComparisonEq(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value == other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonNe(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value != other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonLt(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value < other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonGt(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value > other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonLte(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value <= other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonGte(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value >= other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  andedBy(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value && other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  oredBy(other) {
    if (other.name == "Number") {
      return {
        result: new Number(+(this.value || other.value)).setContext(
          this.context
        ),
        error: null,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  notted() {
    return new Number(this.value == 0 ? 1 : 0).setContext(this.context);
  }

  isTrue() {
    return this.value != 0;
  }

  copy() {
    let copy = new Number(this.value);
    copy.setPosition(this.positionStart, this.positionEnd);
    copy.setContext(this.context);
    return copy;
  }

  toString() {
    return this.value.toString();
  }

  logging() {
    return this.value.toString();
  }
}

export default Number;
