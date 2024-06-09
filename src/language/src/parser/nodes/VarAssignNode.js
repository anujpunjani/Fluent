import Node from "./Node";

class VarAssignNode extends Node {
  constructor(varNameToken, valueNode) {
    super();
    this.varNameToken = varNameToken;
    this.valueNode = valueNode;
    this.postionStart = this.varNameToken.postionStart;
    this.postionEnd = this.valueNode.postionEnd;
    this.name = "VarAssignNode";
  }

  toString() {
    return `(${this.varNameToken.value}=${
      this.valueNode.token ? this.valueNode.token.value : this.valueNode
    })`;
  }
}

export default VarAssignNode;
