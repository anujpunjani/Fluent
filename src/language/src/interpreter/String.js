import Value from "./Value";
import Number from "./Number";
import { RuntimeError } from "../errors";

class String extends Value {
  constructor(value) {
    super();
    this.value = value;
    this.name = "String";
    this.length = this.value.length;
  }

  addedTo(other) {
    if (other.name == "String")
      return {
        result: new String(this.value + other.value).setContext(this.context),
        error: null,
      };
    else if (other.name == "Number")
      return {
        result: new String(this.value + `${other.value}`).setContext(
          this.context
        ),
        error: null,
      };
    else if (other.name == "List")
      return {
        result: new String(this.value + other.toString()).setContext(
          this.context
        ),
        error: null,
      };
    else return this.illegalOperation(this, other);
  }

  multedBy(other) {
    if (other.name == "Number") {
      let result = `${this.value}`.repeat(other.value);
      return {
        result: new String(result).setContext(this.context),
        error: null,
      };
    } else return this.illegalOperation(this, other);
  }

  getIndex(other) {
    if (other.name == "Number") {
      if (other.value >= 0 && other.value <= this.value.length)
        return { result: new String(this.value[other.value]), error: null };
      else
        return {
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Element at this index could not be retrieved from string because index is out of bounds",
            this.context
          ),
          result: null,
        };
    } else return this.illegalOperation(this, other);
  }

  getComparisonEq(other) {
    if (other.name == "String") {
      return {
        error: null,
        result: new Number(+(this.value == other.value)).setContext(
          this.context
        ),
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonNe(other) {
    if (other.name == "String") {
      return {
        error: null,
        result: new Number(+(this.value != other.value)).setContext(
          this.context
        ),
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  getComparisonLt(other) {
    if (other.name == "String") {
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
    if (other.name == "String") {
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
    if (other.name == "String") {
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
    if (other.name == "String") {
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

  oredBy(other) {
    if (other.name == "String") {
      return {
        error: null,
        result: this.value || other.value ? Number.true : Number.false,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  andedBy(other) {
    if (other.name == "String") {
      return {
        error: null,
        result: this.value && other.value ? Number.true : Number.false,
      };
    } else {
      return this.illegalOperation(this, other);
    }
  }

  isTrue() {
    return this.value.length > 0;
  }

  toString() {
    return `"${this.value}"`;
  }

  logging() {
    return `${this.value}`;
  }

  copy() {
    return new String(this.value);
  }
}

export default String;
