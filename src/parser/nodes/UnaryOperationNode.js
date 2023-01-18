const Token = require("../../lexer/Token");
const Node = require("./Node");

class UnaryOpNode extends Node {
	/**
	 * @param {Token} operationtoken
	 * @param {Node} node
	 */
	constructor(operationtoken, node) {
		super();
		this.operationtoken = operationtoken;
		this.node = node;

		this.positionStart = this.operationtoken.positionStart;
		this.positionEnd = this.node.positionEnd;

		this.name = "UnaryOpNode";
	}

	toString() {
		return `(${this.operationtoken.toString()}, ${this.node.toString()})`;
	}
}

module.exports = UnaryOpNode;
