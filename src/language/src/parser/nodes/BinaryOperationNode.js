import Node from "./Node";

class BinOpNode extends Node {
  /**
   * @param {Node} leftNode
   * @param {Token} operationToken
   * @param {Node} rightNode
   */
  constructor(leftNode, operationToken, rightNode) {
    super();
    this.leftNode = leftNode;
    this.operationToken = operationToken;
    this.rightNode = rightNode;

    this.positionStart = this.leftNode.positionStart;
    this.positionEnd = this.rightNode.positionEnd;

    this.name = "BinOpNode";
  }

  toString() {
    return `(${this.leftNode.toString()}, ${this.operationToken.toString()}, ${this.rightNode.toString()})`;
  }
}

export default BinOpNode;
