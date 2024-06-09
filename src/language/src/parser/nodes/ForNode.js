import Node from "./Node";

class ForNode extends Node {
  constructor(
    varNameToken,
    startValueNode,
    endValueNode,
    stepValueNode,
    bodyNode,
    shouldReturnNull
  ) {
    super();
    this.varNameToken = varNameToken;
    this.startValueNode = startValueNode;
    this.endValueNode = endValueNode;
    this.stepValueNode = stepValueNode;
    this.bodyNode = bodyNode;
    this.shouldReturnNull = shouldReturnNull;

    this.positionStart = this.varNameToken.positionStart;
    this.positionEnd = this.bodyNode.positionEnd;

    this.name = "ForNode";
  }

  toString() {
    return "ForNode";
  }
}

export default ForNode;
