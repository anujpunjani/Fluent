import Node from "./Node";

class FuncDefNode extends Node {
  /**
   * @param {Token} varNameToken
   * @param {Token[]} argNameTokens
   * @param {Node} bodyNode
   */
  constructor(varNameToken, argNameTokens, bodyNode, shouldAutoReturn) {
    super();
    this.varNameToken = varNameToken;
    this.argNameTokens = argNameTokens;
    this.bodyNode = bodyNode;
    this.shouldAutoReturn = shouldAutoReturn;

    if (this.varNameToken) {
      this.positionStart = this.varNameToken.positionStart;
    } else if (this.argNameTokens.length > 0) {
      this.positionStart = this.argNameTokens[0].positionStart;
    } else {
      this.bodyNode.positionStart;
    }

    this.positionEnd = this.bodyNode.positionEnd;

    this.name = "FuncDefNode";
  }

  toString() {
    return `function: ${
      this.varNameToken ? this.varNameToken.value : "anonymous"
    }}`;
  }
}

export default FuncDefNode;
