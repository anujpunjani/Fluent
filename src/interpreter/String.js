const Value = require("./Value");
const Number = require("./Number");

class String extends Value {
	constructor(value) {
		super();
		this.value = value;
		this.name = "String";
	}

	addedTo(other) {
		if (other.name == "String")
			return { result: new String(this.value + other.value).setContext(this.context), error: null };
		else return { error: this.illegalOperation(this, other), result: null };
	}

	multedBy(other) {
		if (other.name == "Number") {
			let result = `${this.value}`.repeat(other.value);
			return { result: new String(result).setContext(this.context), error: null };
		} else return { error: this.illegalOperation(this, other), result: null };
	}

	getComparisonEq(other) {
		if (other.name == "String") {
			return this.value == other.value ? Number.true : Number.false;
		} else {
			return Number.false;
		}
	}

	getComparisonNe(other) {
		if (other.name == "String") {
			return this.value != other.value ? Number.true : Number.false;
		} else {
			return Number.false;
		}
	}

	oredBy(other) {
		return this.value || other.value ? Number.true : Number.false;
	}

	andedBy(other) {
		return this.value && other.value ? Number.true : Number.false;
	}

	isTrue() {
		return this.value.length > 0;
	}

	toString() {
		return `"${this.value}"`;
	}

	logging() {
		return `${this.value}`;
	}

	copy() {
		return new String(this.value);
	}
}

module.exports = String;
