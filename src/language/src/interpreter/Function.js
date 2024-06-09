import BaseFunction from "./BaseFunction";
import Number from "./Number";
import RuntimeResult from "./RuntimeResult";

class Function extends BaseFunction {
  /**
   *
   * @param {string} name
   * @param {Node} bodyNode
   * @param {Node[]} argNames
   */
  constructor(functionName, bodyNode, argNames, shouldAutoReturn) {
    super(functionName);

    this.bodyNode = bodyNode;
    this.argNames = argNames;
    this.shouldAutoReturn = shouldAutoReturn;

    this.name = "Function";
  }

  execute(interpreter, args) {
    // let interpreter = new Interpreter();
    let response = new RuntimeResult();
    let executionContext = this.generateNewContext();

    response.register(
      this.checkAndPopulateArgs(this.argNames, args, executionContext)
    );
    if (response.shouldReturn()) return response;
    let value = response.register(
      interpreter.visit(this.bodyNode, executionContext)
    );
    if (response.shouldReturn() && response.functionReturnValue == null)
      return response;

    let returnValue = response.functionReturnValue || value || Number.null;
    return response.success(returnValue);
  }

  copy() {
    let copy = new Function(
      this.functionName,
      this.bodyNode,
      this.argNames,
      this.shouldAutoReturn
    );
    copy.setContext(this.context);
    copy.setPosition(this.positionStart, this.positionEnd);
    return copy;
  }
}

export default Function;
