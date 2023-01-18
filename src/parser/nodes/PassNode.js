const Node = require("./Node");

class PassNode extends Node {
	constructor(positionStart, positionEnd) {
		super();
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
	}

	toString() {
		return `(pass)`;
	}
}

module.exports = PassNode;
