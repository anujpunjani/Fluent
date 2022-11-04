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
    toks.push(token.toString());           //converting each element of tokens and convering it into string for printing.
  });

  console.log(toks);
}

while (true) {
  var input = prompt("Fluent: ");
  run("stdin", input);
}
