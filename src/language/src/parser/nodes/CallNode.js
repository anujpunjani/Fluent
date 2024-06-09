import Node from "./Node";

class CallNode extends Node {
  /**
   * @param {Node} nodeToCall
   * @param {Node[]} argNodes
   */
  constructor(nodeToCall, argNodes) {
    super();
    this.nodeToCall = nodeToCall;
    this.argNodes = argNodes;

    this.positionStart = this.nodeToCall.positionStart;

    if (this.argNodes.length > 0) {
      this.positionEnd = this.argNodes[this.argNodes.length - 1].positionEnd;
    } else {
      this.positionEnd = this.nodeToCall.positionEnd;
    }

    this.name = "CallNode";
  }

  toString() {
    return `(call: ${this.nodeToCall.toString()})`;
  }
}

export default CallNode;
