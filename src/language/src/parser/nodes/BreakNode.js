import Node from "./Node";

class BreakNode extends Node {
  constructor(positionStart, positionEnd) {
    super();
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
  }

  toString() {
    return `(break)`;
  }
}

export default BreakNode;
