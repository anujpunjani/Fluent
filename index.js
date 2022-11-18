const Context = require("./Interpreter/Context");
const Interpreter = require("./Interpreter/Interpreter");
const Lexer = require("./Lexer/Lexer");

const prompt = require("prompt-sync")({ sigint: true });

function run(filename, filecontent) {
  const lexer = new Lexer(filename, filecontent);
  let { tokens, errors } = lexer.generateTokens();

  if (errors) {
    console.log(errors.asError());
    return;
  }
  //! console.log(tokens);
  let toks = [];

  tokens.forEach((token) => {
    toks.push(token.toString()); //converting each element of tokens and convering it into string for printing.
  });

  console.log(toks);

  const parser = new Parser(tokens);
  let ast = parser.parse(); // ast= abstract syntax tree
  if (!ast.error) {
    console.log(ast.node.toString());
  } else {
    console.log(ast.error.asError());
    return;
  }

  //Inerpreter
  const interpreter = new Interpreter();

  //Context
  const context = new Context("<program>");

  let result = interpreter.visit(ast.node, context);
  if (result.error) console.log(result.error.asError());
  else console.log(result.value.toString());
}

while (true) {
  var input = prompt("Fluent: ");
  run("stdin", input);
}
