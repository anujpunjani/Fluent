import { RuntimeError } from "../errors";
import Context from "./Context";
import Position from "../lexer/Position";

class Value {
  constructor() {
    this.setPosition();
    this.setContext();
    this.name = "Value";
  }

  /**
   * @param {Position} positionStart
   * @param {Position} positionEnd
   * @returns {Value}
   */
  setPosition(positionStart, positionEnd) {
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    return this;
  }

  addedTo(other) {
    return this.illegalOperation(other);
  }

  subbedBy(other) {
    return this.illegalOperation(other);
  }

  multedBy(other) {
    return this.illegalOperation(other);
  }

  diviedBy(other) {
    return this.illegalOperation(other);
  }

  moddedBy(other) {
    return this.illegalOperation(other);
  }

  powerdBy(other) {
    return this.illegalOperation(other);
  }

  getIndex(other) {
    return this.illegalOperation(other);
  }

  getComparisonEq(other) {
    return this.illegalOperation(other);
  }

  getComparisonNe(other) {
    return this.illegalOperation(other);
  }

  getComparisonLt(other) {
    return this.illegalOperation(other);
  }

  getComparisonGt(other) {
    return this.illegalOperation(other);
  }

  getComparisonLte(other) {
    return this.illegalOperation(other);
  }

  getComparisonGte(other) {
    return this.illegalOperation(other);
  }

  andedBy(other) {
    return this.illegalOperation(other);
  }

  oredBy(other) {
    return this.illegalOperation(other);
  }

  notted() {
    throw new Error("No notted method defined");
  }

  isTrue() {
    throw new Error("No isTrue method defined");
  }

  /**
   * @param {Context} context
   * @returns {Value}
   */
  setContext(context) {
    this.context = context;
    return this;
  }

  copy() {
    throw new Error("No copy method defined");
  }

  illegalOperation(self, other = null) {
    if (!other) other = self;
    return {
      result: null,
      error: new RuntimeError(
        this.positionStart,
        other.positionEnd,
        "illegal Operation",
        this.context
      ),
    };
  }
}

export default Value;
