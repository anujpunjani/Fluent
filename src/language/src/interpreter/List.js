import { RuntimeError } from "../errors";
import Value from "./Value";

class List extends Value {
  constructor(elements) {
    super();
    this.elements = elements;
    this.name = "List";
  }

  addedTo(other) {
    let newList = this.copy();
    newList.elements.push(other);
    return { result: newList, error: null };
  }

  subbedBy(other) {
    if (other.name == "Number") {
      let newList = this.copy();
      try {
        newList.elements.splice(other.value, 1);
        return { result: newList, error: null };
      } catch (error) {
        return {
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Element at this index could not be removed from list because index is out of bounds",
            this.context
          ),
          result: null,
        };
      }
    } else return this.illegalOperation(this, other);
  }

  multedBy(other) {
    if (other.name == "List") {
      let newList = this.copy();
      newList.elements = newList.elements.concat(other.elements);
      return { result: newList, error: null };
    } else return this.illegalOperation(this, other);
  }

  getIndex(other) {
    if (other.name == "Number") {
      if (this.elements[other.value])
        return { result: this.elements[other.value], error: null };
      else
        return {
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Element at this index could not be retrieved from list because index is out of bounds",
            this.context
          ),
          result: null,
        };
    } else return this.illegalOperation(this, other);
  }

  diviedBy(other) {
    if (other.name == "Number") {
      if (this.elements[other.value])
        return { result: this.elements[other.value], error: null };
      else
        return {
          error: new RuntimeError(
            this.positionStart,
            this.positionEnd,
            "Element at this index could not be retrieved from list because index is out of bounds",
            this.context
          ),
          result: null,
        };
    } else return this.illegalOperation(this, other);
  }

  copy() {
    let copy = new List(this.elements);
    copy.setPosition(this.positionStart, this.positionEnd);
    copy.setContext(this.context);
    return copy;
  }

  logging() {
    let n = [];
    this.elements.forEach((x) => {
      n.push(x.logging());
    });
    return `[${n.join(", ")}]`;
  }

  toString() {
    let n = [];
    this.elements.forEach((x) => {
      n.push(x.toString());
    });
    return `[${n.join(", ")}]`;
  }
}

export default List;
