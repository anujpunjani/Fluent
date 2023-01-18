const Node = require("./Node");

class VarAccessNode extends Node {
	constructor(varNameToken) {
		super();
		this.varNameToken = varNameToken;
		this.positionStart = this.varNameToken.positionStart;
		this.positionEnd = this.varNameToken.positionEnd;
		this.name = "VarAccessNode";
	}

	toString() {
		return `(${this.varNameToken.toString()})`;
	}
}

module.exports = VarAccessNode;
