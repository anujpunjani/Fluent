class UnaryOpNode {
  constructor(operationToken, node) {
    this.operationToken = operationToken;
    this.node = node;
    this.positionStart = this.operationToken.positionStart;
    this.positionEnd = this.operationToken.positionEnd;
  }
  toString() {
    return `(${this.operationToken}, ${this.node})`;
  }
}
module.exports = UnaryOpNode;
