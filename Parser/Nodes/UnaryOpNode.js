class UnaryOpNode {
  constructor(operationToken, node) {
    this.operationToken = operationToken;
    this.node = node;
  }
  toString() {
    return `(${this.operationToken}, ${this.node})`;
  }
}
module.exports = UnaryOpNode;
