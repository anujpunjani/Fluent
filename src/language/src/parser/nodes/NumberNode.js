import Node from "./Node";

class NumberNode extends Node {
  /**
   * @param {Token} token
   */
  constructor(token) {
    super();
    this.token = token;
    this.positionStart = this.token.positionStart;
    this.positionEnd = this.token.positionEnd;
    this.name = "NumberNode";
  }

  toString() {
    return `${this.token.toString()}`;
  }
}

export default NumberNode;
