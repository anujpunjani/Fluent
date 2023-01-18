const Position = require("./Position");

const TokenTypes = Object.freeze({
	INT: "INT",
	FLOAT: "FLOAT",
	STRING: "STRING",
	IDENTIFIER: "IDENTIFIER",
	KEYWORD: "KEYWORD",
	// Math
	PLUS: "PLUS",
	MINUS: "MINUS",
	MUL: "MUL",
	DIV: "DIV",
	POW: "POW",
	MOD: "MOD",
	EQ: "EQ",
	// Boolean
	EE: "EE",
	NE: "NE",
	LT: "LT",
	GT: "GT",
	LTE: "LTE",
	GTE: "GTE",
	LPAREN: "LPAREN",
	RPAREN: "RPAREN",
	LBRACE: "LBRACE",
	RBRACE: "RBRACE",
	LSQUARE: "LSQUARE",
	RSQUARE: "RSQUARE",
	EOF: "EOF",
	NEWLINE: "NEWLINE",
	COLON: "COLON",
	COMMA: "COMMA",
	ARROW: "ARROW",
	KEYWORDS: [
		"let",
		"and",
		"or",
		"not",
		"if",
		"then",
		"else",
		"elif",
		"for",
		"to",
		"step",
		"while",
		"until",
		"define",
		"function",
		"return",
		"continue",
		"break",
		"pass",
	],
});

const constants = Object.freeze({
	numbers: "0123456789",
	letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
});

class Token {
	/**
	 *
	 * @param {string} type
	 * @param {string} value
	 * @param {Position} positionStart
	 * @param {Position} positionEnd
	 */
	constructor(type, value, positionStart, positionEnd) {
		this.type = type;
		this.value = value;
		if (positionStart) {
			this.positionStart = positionStart.copy();
			this.positionEnd = positionStart.copy();
			this.positionEnd.advance();
		}
		if (positionEnd) this.positionEnd = positionEnd;
	}

	/**
	 *
	 * @param {string} type
	 * @param {string} value
	 * @returns {boolean}
	 */
	matches(type, value) {
		return this.type == type && this.value == value;
	}

	/**
	 *
	 * @returns {string}
	 */
	toString() {
		if (this.value) return `${this.type}:${this.value}`;
		return this.type;
	}
}

module.exports = { Token, constants, TokenTypes };
