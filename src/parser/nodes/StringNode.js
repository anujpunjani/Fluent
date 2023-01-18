const Token = require("../../lexer/Token");
const Node = require("./Node");

class StringNode extends Node {
	/**
	 * @param {Token} token
	 */
	constructor(token) {
		super();
		this.token = token;
		this.positionStart = this.token.positionStart;
		this.positionEnd = this.token.positionEnd;
		this.name = "StringNode";
	}

	toString() {
		return `${this.token.toString()}`;
	}
}

module.exports = StringNode;
