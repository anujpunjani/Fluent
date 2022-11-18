class NumberNode {
  constructor(token) {
    this.token = token;
    this.positionStart = this.token.positionStart;
    this.positionEnd = this.token.positionEnd;
  }
  toString() {
    return `${this.token}`;
  }
}
module.exports = NumberNode;
