import Node from "./Node";

class IndexAccessNode extends Node {
  /**
   * @param {Token} varNameToken
   * @param {Node} valueNode
   */
  constructor(VarAccessNode, indexValueNode, positionStart, positionEnd) {
    super();
    this.VarAccessNode = VarAccessNode;
    this.indexValueNode = indexValueNode;

    this.positionStart = positionStart;
    this.positionEnd = positionEnd;

    this.name = "IndexAccessNode";
  }

  toString() {
    return `(${this.VarAccessNode.varNameToken.value}=${
      this.valueNode.token ? this.valueNode.token.value : this.valueNode
    })`;
  }
}

export default IndexAccessNode;
