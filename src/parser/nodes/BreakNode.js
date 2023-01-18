const Node = require("./Node");

class BreakNode extends Node {
	constructor(positionStart, positionEnd) {
		super();
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
	}

	toString() {
		return `(break)`;
	}
}

module.exports = BreakNode;
