import Node from "./Node";

class VarAssignNode extends Node {
  constructor(varNameToken, valueNode) {
    super();
    this.varNameToken = varNameToken;
    this.valueNode = valueNode;
    this.positionStart = this.varNameToken.positionStart;
    this.positionEnd = this.valueNode.positionEnd;
    this.name = "VarAssignNode";
  }

  toString() {
    return `(${this.varNameToken.value}=${
      this.valueNode.token ? this.valueNode.token.value : this.valueNode
    })`;
  }
}

export default VarAssignNode;
