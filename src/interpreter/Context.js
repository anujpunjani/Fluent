const Position = require("../lexer/Position");

class Context {
	/**
	 * @param {string} displayName
	 * @param {Context} parent
	 * @param {Position} parentEntryPosition
	 */
	constructor(displayName, parent = null, parentEntryPosition = null) {
		this.displayName = displayName;
		this.parent = parent;
		this.parentEntryPosition = parentEntryPosition;
		this.symbolTable = null;
	}
}

module.exports = Context;
