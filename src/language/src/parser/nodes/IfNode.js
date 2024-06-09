import Node from "./Node";

class IfNode extends Node {
  constructor(cases, elseCase) {
    super();
    this.cases = cases;
    this.elseCase = elseCase;

    this.postionStart = this.cases[0][0].positionStart;
    this.positionEnd = (this.elseCase ||
      this.cases[this.cases.length - 1])[0].positionEnd;

    this.name = "IfNode";
  }

  toString() {
    return `(ifNode: (cases: ${this.cases}) (elseCase: ${this.elseCase}))`;
  }
}

export default IfNode;
