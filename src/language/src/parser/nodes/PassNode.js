import Node from "./Node";

class PassNode extends Node {
  constructor(positionStart, positionEnd) {
    super();
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
  }

  toString() {
    return `(pass)`;
  }
}

export default PassNode;
