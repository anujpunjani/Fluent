import BaseFunction from "./BaseFunction";
import RuntimeResult from "./RuntimeResult";
import { getAttribute } from "../utils";
import Number from "./Number";
import Context from "./Context";
import String from "./String";
import { RuntimeError } from "../errors";

// const { run } = require("../runner");

class BuiltInFunction extends BaseFunction {
  static print = new BuiltInFunction("print");
  static printReturn = new BuiltInFunction("printReturn");
  static input = new BuiltInFunction("input");
  static clear = new BuiltInFunction("clear");
  static abs = new BuiltInFunction("abs");
  static isNumber = new BuiltInFunction("isNumber");
  static isString = new BuiltInFunction("isString");
  static isList = new BuiltInFunction("isList");
  static isFunction = new BuiltInFunction("isFunction");
  static add = new BuiltInFunction("add");
  static remove = new BuiltInFunction("remove");
  static concat = new BuiltInFunction("concat");
  static len = new BuiltInFunction("len");
  // static run = new BuiltInFunction("run");

  static inputValues = [];
  static currentInput = -1;

  constructor(functionName) {
    super(functionName);

    this.printArgs = ["value"];
    this.printReturnArgs = ["value"];
    this.inputArgs = [];
    // this.clearArgs = [];
    this.absArgs = ["value"];
    this.isNumberArgs = ["value"];
    this.isStringArgs = ["value"];
    this.isListArgs = ["value"];
    this.isFunctionArgs = ["value"];
    this.addArgs = ["list", "value"];
    this.removeArgs = ["list", "index"];
    this.concatArgs = ["listA", "listB"];
    this.lenArgs = ["value"];
    // this.runArgs = ["filename"];

    this.name = "BuiltInFunction";
  }

  execute(interpreter, args) {
    let response = new RuntimeResult();
    let executionContext = this.generateNewContext();

    let methodName = `execute_${this.functionName}`;
    let methodArgs = `${this.functionName}Args`;
    let method = getAttribute(this, methodName, this.noVisitMethod);

    // response.register(this.checkAndPopulateArgs(method.Args, args, executionContext));
    response.register(
      this.checkAndPopulateArgs(this[methodArgs], args, executionContext)
    );
    if (response.shouldReturn()) return response;

    let value = response.register(method(executionContext));
    if (response.shouldReturn()) return response;
    return response.success(value);
  }

  noVisitMethod(node, context) {
    throw new Error(`${this.functionName} cannot be visited`);
  }

  copy() {
    let copy = new BuiltInFunction(this.functionName);
    copy.setContext(this.context);
    copy.setPosition(this.positionStart, this.positionEnd);
    return copy;
  }

  toString() {
    return `<built-in function ${this.functionName}>`;
  }

  // ###################################################################

  // Built-in functions
  /**
   * @param {Context} executionContext
   */
  execute_print(executionContext) {
    let value = executionContext.symbolTable.get("value");
    console.log(value.logging());
    return new RuntimeResult().success(Number.null);
  }

  /**
   * @param {Context} executionContext
   */
  execute_printReturn(executionContext) {
    let value = executionContext.symbolTable.get("value");
    console.log(value.logging());
    return new RuntimeResult().success(new String(value.logging()));
  }

  /**
   * @param {Context} executionContext
   */
  execute_input(executionContext) {
    if (BuiltInFunction.inputValues.length === 0) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `No input provided`,
          executionContext
        )
      );
    }

    BuiltInFunction.currentInput++;

    if (BuiltInFunction.inputValues.length <= BuiltInFunction.currentInput) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `No input provided`,
          executionContext
        )
      );
    }

    let value = BuiltInFunction.inputValues[BuiltInFunction.currentInput];

    if (typeof value == "string" && !isNaN(value) && !isNaN(parseFloat(value)))
      value = new Number(parseFloat(value));
    else value = new String(value);

    return new RuntimeResult().success(value);
  }

  /**
   * @param {Context} executionContext
   */
  // execute_clear(executionContext) {
  //   console.clear();
  //   return new RuntimeResult().success(Number.null);
  // }

  /**
   * @param {Context} executionContext
   */
  execute_abs(executionContext) {
    let number = executionContext.symbolTable.get("value");

    if (number.name != "Number")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `Argument must be a number`,
          executionContext
        )
      );

    return new RuntimeResult().success(new Number(Math.abs(number.value)));
  }

  /**
   * @param {Context} executionContext
   */
  execute_isNumber(executionContext) {
    let value = executionContext.symbolTable.get("value");
    return new RuntimeResult().success(
      value.name == "Number" ? Number.true : Number.false
    );
  }

  /**
   * @param {Context} executionContext
   */
  execute_isString(executionContext) {
    let value = executionContext.symbolTable.get("value");
    return new RuntimeResult().success(
      value.name == "String" ? Number.true : Number.false
    );
  }
  /**
   * @param {Context} executionContext
   */
  execute_isList(executionContext) {
    let value = executionContext.symbolTable.get("value");
    return new RuntimeResult().success(
      value.name == "List" ? Number.true : Number.false
    );
  }

  /**
   * @param {Context} executionContext
   */
  execute_isFunction(executionContext) {
    let value = executionContext.symbolTable.get("value");
    return new RuntimeResult().success(
      value instanceof BaseFunction ? Number.true : Number.false
    );
  }

  /**
   * @param {Context} executionContext
   */
  execute_add(executionContext) {
    let list = executionContext.symbolTable.get("list");
    let value = executionContext.symbolTable.get("value");

    if (list.name != "List")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `First argument must be a list`,
          executionContext
        )
      );

    list.elements.push(value);
    return new RuntimeResult().success(Number.null);
  }

  /**
   * @param {Context} executionContext
   */
  execute_remove(executionContext) {
    let list = executionContext.symbolTable.get("list");
    let index = executionContext.symbolTable.get("index");

    if (list.name != "List")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `First argument must be a list`,
          executionContext
        )
      );

    if (index.name != "Number")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `Second argument must be a number`,
          executionContext
        )
      );

    if (index.value < 0 || index.value >= list.elements.length)
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `Index out of range`,
          executionContext
        )
      );

    let element = null;
    try {
      element = list.elements.splice(index.value, 1);
    } catch (e) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          e.message,
          executionContext
        )
      );
    }
    return new RuntimeResult().success(element);
  }

  /**
   * @param {Context} executionContext
   */
  execute_concat(executionContext) {
    let listA = executionContext.symbolTable.get("listA");
    let listB = executionContext.symbolTable.get("listB");

    if (listA.name != "List")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `First argument must be a list`,
          executionContext
        )
      );

    if (listB.name != "List")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `Second argument must be a list`,
          executionContext
        )
      );

    listA.elements.concat(listB.elements);
    return new RuntimeResult().success(Number.null);
  }

  /**
   * @param {Context} executionContext
   */
  execute_len(executionContext) {
    let value = executionContext.symbolTable.get("value");

    if (value.name != "List" && value.name != "String")
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `Argument must be a list or string`,
          executionContext
        )
      );

    if (value.name == "List")
      return new RuntimeResult().success(new Number(value.elements.length));
    else return new RuntimeResult().success(new Number(value.length));
  }

  // /**
  //  * @param {Context} executionContext
  //  */
  // execute_run(executionContext) {
  // 	let filename = executionContext.symbolTable.get("filename");

  // 	if (filename != "String")
  // 		return new RuntimeResult().failure(
  // 			new RuntimeError(
  // 				this.positionStart,
  // 				this.positionEnd,
  // 				`First argument must be a string`,
  // 				executionContext
  // 			)
  // 		);

  // 	filename = filename.value;

  // 	let script = null;
  // 	try {
  // 		script = fs.readFileSync(filename, "utf8");
  // 	} catch (e) {
  // 		return new RuntimeResult().failure(
  // 			new RuntimeError(
  // 				this.positionStart,
  // 				this.positionEnd,
  // 				`Failed to load script ${e.message}`,
  // 				executionContext
  // 			)
  // 		);
  // 	}

  // 	let { result, error } = run(filename, script);
  // 	if (error)
  // 		return new RuntimeResult().failure(
  // 			new RuntimeError(
  // 				this.positionStart,
  // 				this.positionEnd,
  // 				`Failed to finish executing script "${filename}"\n${error.toString()}`,
  // 				executionContext
  // 			)
  // 		);
  // 	return new RuntimeResult().success(Number.null);
  // }
}

export default BuiltInFunction;
