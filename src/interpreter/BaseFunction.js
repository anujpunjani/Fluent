const Value = require("./Value");
const SymbolTable = require("./SymbolTable");
const Context = require("./Context");
const RuntimeResult = require("./RuntimeResult");
const { RuntimeError } = require("../errors");

class BaseFunction extends Value {
	constructor(functionName) {
		super();
		this.functionName = functionName || "<anonymous>";
		this.name = "BaseFunction";
	}

	generateNewContext() {
		const newContext = new Context(this.functionName, this.context, this.positionStart);
		newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable);
		return newContext;
	}

	checkArgs(args, argNames) {
		let response = new RuntimeResult();
		if (args.length > argNames.length) {
			return response.failure(
				new RuntimeError(
					this.positionStart,
					this.positionEnd,
					`${args.length - argNames.length} too many args passed into '${this.functionName}'`,
					this.context
				)
			);
		}

		if (args.length < argNames.length) {
			return response.failure(
				new RuntimeError(
					this.positionStart,
					this.positionEnd,
					`${args.length - argNames.length} too few args passed into '${this.functionName}'`,
					this.context
				)
			);
		}

		return response.success(null);
	}

	populateArgs(args, argNames, executionContext) {
		for (let i = 0; i < args.length; i++) {
			let argName = argNames[i];
			let argValue = args[i];
			argValue.setContext(executionContext);
			executionContext.symbolTable.set(argName, argValue);
		}
	}

	checkAndPopulateArgs(argNames, args, executionContext) {
		let response = new RuntimeResult();
		response.register(this.checkArgs(args, argNames));
		if (response.shouldReturn()) return response;
		this.populateArgs(args, argNames, executionContext);
		return response.success(null);
	}
}

module.exports = BaseFunction;
