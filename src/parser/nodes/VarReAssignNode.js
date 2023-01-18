const Node = require("./Node");
const { Token } = require("../../lexer/Token");

class VarReAssignNode extends Node {
	/**
	 * @param {Token} varNameToken
	 * @param {Node} valueNode
	 */
	constructor(VarAccessNode, newValueNode) {
		super();
		this.VarAccessNode = VarAccessNode;
		this.newValueNode = newValueNode;

		this.positionStart = this.VarAccessNode.positionStart;
		this.positionEnd = this.newValueNode.positionEnd;

		this.name = "VarReAssignNode";
	}

	toString() {
		return `(${this.VarAccessNode.varNameToken.value}=${
			this.valueNode.token ? this.valueNode.token.value : this.valueNode
		})`;
	}
}

module.exports = VarReAssignNode;
