const Node = require("./Node");

class ContinueNode extends Node {
	constructor(positionStart, positionEnd) {
		super();
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
	}

	toString() {
		return `(continue)`;
	}
}

module.exports = ContinueNode;
