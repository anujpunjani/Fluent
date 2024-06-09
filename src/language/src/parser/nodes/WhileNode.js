import Node from "./Node";

class WhileNode extends Node {
  constructor(conditionNode, bodyNode, shouldReturnNull) {
    super();
    this.conditionNode = conditionNode;
    this.bodyNode = bodyNode;
    this.shouldReturnNull = shouldReturnNull;

    this.positionStart = this.conditionNode.positionStart;
    this.positionEnd = this.bodyNode.positionEnd;
    this.name = "WhileNode";
  }

  toString() {
    return "WhileNode";
  }
}

export default WhileNode;
