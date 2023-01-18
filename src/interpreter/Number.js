const Value = require("./Value");
const { RuntimeError } = require("../errors");

class Number extends Value {
	static null = new Number(0);
	static false = new Number(0);
	static true = new Number(1);

	/**
	 * @param {Number} value
	 */
	constructor(value) {
		super();
		this.value = value;
		this.name = "Number";
	}

	addedTo(other) {
		if (other.name == "Number")
			return { result: new Number(this.value + other.value).setContext(this.context), error: null };
		else return { error: this.illegalOperation(this, other), result: null };
	}

	subbedBy(other) {
		if (other.name == "Number")
			return { result: new Number(this.value - other.value).setContext(this.context), error: null };
		else return { error: this.illegalOperation(this, other), result: null };
	}

	multedBy(other) {
		if (other.name == "Number")
			return { result: new Number(this.value * other.value).setContext(this.context), error: null };
		else return { error: this.illegalOperation(this, other), result: null };
	}

	diviedBy(other) {
		if (other.name == "Number") {
			if (other.value == 0) {
				return {
					result: null,
					error: new RuntimeError(this.positionStart, this.positionEnd, "Division by zero", this.context),
				};
			}
			return { result: new Number(this.value / other.value).setContext(this.context), error: null };
		} else return { error: this.illegalOperation(this, other), result: null };
	}

	powerdBy(other) {
		if (other.name == "Number") return new Number(this.value ** other.value).setContext(this.context);
		else return { error: this.illegalOperation(this, other), result: null };
	}

	moddedBy(other) {
		if (other.name == "Number") {
			if (other.value == 0) {
				return {
					result: null,
					error: new RuntimeError(this.positionStart, this.positionEnd, "Modulo by zero", this.context),
				};
			}
			return { result: new Number(this.value % other.value).setContext(this.context), error: null };
		} else return { error: this.illegalOperation(this, other), result: null };
	}

	getComparisonEq(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value == other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	getComparisonNe(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value != other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	getComparisonLt(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value < other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	getComparisonGt(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value > other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	getComparisonLte(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value <= other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	getComparisonGte(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value >= other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	andedBy(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value && other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	oredBy(other) {
		if (other.name == "Number") {
			return { result: new Number(+(this.value || other.value)).setContext(this.context), error: null };
		} else {
			return { error: this.illegalOperation(this, other), result: null };
		}
	}

	notted() {
		return new Number(this.value == 0 ? 1 : 0).setContext(this.context);
	}

	isTrue() {
		return this.value != 0;
	}

	copy() {
		let copy = new Number(this.value);
		copy.setPosition(this.positionStart, this.positionEnd);
		copy.setContext(this.context);
		return copy;
	}

	toString() {
		return this.value.toString();
	}

	logging() {
		return this.value.toString();
	}
}

module.exports = Number;
