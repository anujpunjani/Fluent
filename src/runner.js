const BuiltInFunction = require("./interpreter/BuiltInFunction");
const Context = require("./interpreter/Context");
const Interpreter = require("./interpreter/Interpreter");
const Number = require("./interpreter/Number");
const SymbolTable = require("./interpreter/SymbolTable");
const Lexer = require("./lexer/Lexer");
const Parser = require("./parser/Parser");

GlobalSymbolTable = new SymbolTable();
GlobalSymbolTable.set("null", Number.null);
GlobalSymbolTable.set("true", Number.true);
GlobalSymbolTable.set("false", Number.false);

// Built-in functions
GlobalSymbolTable.set("print", BuiltInFunction.print);
GlobalSymbolTable.set("printReturn", BuiltInFunction.printReturn);
GlobalSymbolTable.set("input", BuiltInFunction.input);
GlobalSymbolTable.set("clear", BuiltInFunction.clear);
GlobalSymbolTable.set("isNumber", BuiltInFunction.isNumber);
GlobalSymbolTable.set("isString", BuiltInFunction.isString);
GlobalSymbolTable.set("isList", BuiltInFunction.isList);
GlobalSymbolTable.set("isFunction", BuiltInFunction.isFunction);
GlobalSymbolTable.set("add", BuiltInFunction.add);
GlobalSymbolTable.set("remove", BuiltInFunction.remove);
GlobalSymbolTable.set("concat", BuiltInFunction.concat);
GlobalSymbolTable.set("len", BuiltInFunction.len);
GlobalSymbolTable.set("run", BuiltInFunction.run);

/**
 * @param {string} filename
 * @param {string} filecontent
 */
function run(filename, filecontent) {
	const lexer = new Lexer(filename, filecontent);
	const { tokens, error } = lexer.generateTokens();
	if (error) {
		// console.log(error.asError());
		return { result: null, error: error };
	}

	let toks = [];
	tokens.forEach((token) => {
		toks.push(token.toString());
	});
	// console.log(toks);

	let parser = new Parser(tokens);
	// ast -> abstract syntax tree
	let ast = parser.parse();
	if (ast.error) {
		// console.log(ast.error.asError());
		return { result: null, error: ast.error };
	}

	// console.log(ast.node.toString());
	// console.log(ast.node);

	let interpreter = new Interpreter();
	let context = new Context("<program>");
	context.symbolTable = GlobalSymbolTable;
	let result = interpreter.visit(ast.node, context);
	// console.log(result);
	// if (result.error) {
	// 	console.log(result.error.asError());
	// 	return;
	// } else if (result.value) console.log(result.value.toString());

	return { result: result.value, error: result.error };
}

module.exports = { run };
