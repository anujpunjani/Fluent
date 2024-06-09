import Node from "./Node";

class StringNode extends Node {
  /**
   * @param {Token} token
   */
  constructor(token) {
    super();
    this.token = token;
    this.positionStart = this.token.positionStart;
    this.positionEnd = this.token.positionEnd;
    this.name = "StringNode";
  }

  toString() {
    return `${this.token.toString()}`;
  }
}

export default StringNode;
