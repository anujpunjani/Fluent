import Node from "./Node";

class UnaryOpNode extends Node {
  /**
   * @param {Token} operationToken
   * @param {Node} node
   */
  constructor(operationToken, node) {
    super();
    this.operationToken = operationToken;
    this.node = node;

    this.positionStart = this.operationToken.positionStart;
    this.positionEnd = this.node.positionEnd;

    this.name = "UnaryOpNode";
  }

  toString() {
    return `(${this.operationToken.toString()}, ${this.node.toString()})`;
  }
}

export default UnaryOpNode;
