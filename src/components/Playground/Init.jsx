import BuiltInFunction from "../../language/src/interpreter/BuiltInFunction";
import Interpreter from "../../language/src/interpreter/Interpreter";
import Number from "../../language/src/interpreter/Number";
import SymbolTable from "../../language/src/interpreter/SymbolTable";
import Lexer from "../../language/src/lexer/Lexer";
import Parser from "../../language/src/parser/Parser";
import Context from "../../language/src/interpreter/Context";

function interpret(code, input) {
  const GlobalSymbolTable = new SymbolTable();
  GlobalSymbolTable.set("null", Number.null);
  GlobalSymbolTable.set("true", Number.true);
  GlobalSymbolTable.set("false", Number.false);

  // Built-in functions
  GlobalSymbolTable.set("print", BuiltInFunction.print);
  GlobalSymbolTable.set("printReturn", BuiltInFunction.printReturn);
  GlobalSymbolTable.set("input", BuiltInFunction.input);
  GlobalSymbolTable.set("abs", BuiltInFunction.abs);
  // GlobalSymbolTable.set("clear", BuiltInFunction.clear);
  GlobalSymbolTable.set("isNumber", BuiltInFunction.isNumber);
  GlobalSymbolTable.set("isString", BuiltInFunction.isString);
  GlobalSymbolTable.set("isList", BuiltInFunction.isList);
  GlobalSymbolTable.set("isFunction", BuiltInFunction.isFunction);
  GlobalSymbolTable.set("add", BuiltInFunction.add);
  GlobalSymbolTable.set("remove", BuiltInFunction.remove);
  GlobalSymbolTable.set("concat", BuiltInFunction.concat);
  GlobalSymbolTable.set("len", BuiltInFunction.len);
  // GlobalSymbolTable.set("run", BuiltInFunction.run);

  BuiltInFunction.inputValues = input[0].length === 0 ? [] : input;
  BuiltInFunction.currentInput = -1;

  const lexer = new Lexer("<stdin>", code);
  const { tokens, error } = lexer.generateTokens();
  if (error) return { result: null, error: error };

  let toks = [];
  tokens.forEach((token) => {
    toks.push(token.toString());
  });

  // console.log(toks);

  let parser = new Parser(tokens);
  // ast -> abstract syntax tree
  let ast = parser.parse();
  // if (ast.error) console.log(ast.error.asError());
  if (ast.error) return { result: null, error: ast.error };
  // console.log(ast);
  let interpreter = new Interpreter();
  let context = new Context("<program>");
  context.symbolTable = GlobalSymbolTable;
  let result = interpreter.visit(ast.node, context);

  // console.log({ result: result.value, error: result.error });
  return { result: result.value, error: result.error };
}

export { interpret };
