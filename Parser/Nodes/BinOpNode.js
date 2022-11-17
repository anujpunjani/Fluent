// binary operation node
class BinOpNode {
  constructor(leftNode, operationToken, rightNode) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.operationToken = operationToken;
  }
  toString() {
    return `(${this.leftNode},${this.operationToken},${this.rightNode})`;
  }
}
module.exports = BinOpNode;
