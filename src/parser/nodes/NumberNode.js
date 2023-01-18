const Token = require("../../lexer/Token");
const Node = require("./Node");

class NumberNode extends Node {
	/**
	 * @param {Token} token
	 */
	constructor(token) {
		super();
		this.token = token;
		this.positionStart = this.token.positionStart;
		this.positionEnd = this.token.positionEnd;
		this.name = "NumberNode";
	}

	toString() {
		return `${this.token.toString()}`;
	}
}

module.exports = NumberNode;
