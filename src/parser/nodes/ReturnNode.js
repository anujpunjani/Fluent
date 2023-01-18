const Node = require("./Node");

class ReturnNode extends Node {
	constructor(nodeToReturn, positionStart, positionEnd) {
		super();
		this.nodeToReturn = nodeToReturn;
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
	}

	toString() {
		return `(return: ${this.nodeToReturn})`;
	}
}

module.exports = ReturnNode;
