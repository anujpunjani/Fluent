// binary operation node
class BinOpNode {
  constructor(leftNode, operationToken, rightNode) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.operationToken = operationToken;
    this.positionStart = this.leftNode.positionStart;
    this.positionEnd = this.rightNode.positionEnd;
  }
  toString() {
    return `(${this.leftNode},${this.operationToken},${this.rightNode})`;
  }
}
module.exports = BinOpNode;
