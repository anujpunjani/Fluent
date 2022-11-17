class NumberNode {
  constructor(token) {
    this.token = token;
  }
  toString() {
    return `${this.token}`;
  }
}
module.exports = NumberNode;
