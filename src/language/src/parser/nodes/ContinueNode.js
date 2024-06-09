import Node from "./Node";

class ContinueNode extends Node {
  constructor(positionStart, positionEnd) {
    super();
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
  }

  toString() {
    return `(continue)`;
  }
}

export default ContinueNode;
