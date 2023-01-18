const Position = require("../../lexer/Position");

class Node {
	/**
	 * @type {Position}
	 */
	positionStart = null;
	/**
	 * @type {Position}
	 */
	positionEnd = null;
	name = "";
}

module.exports = Node;
