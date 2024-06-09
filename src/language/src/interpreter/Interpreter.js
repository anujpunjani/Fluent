import Node from "../parser/nodes/Node";
import {
  BinOpNode,
  NumberNode,
  UnaryOpNode,
  VarAssignNode,
  VarAccessNode,
  CallNode,
  FuncDefNode,
  StringNode,
  ListNode,
  ReturnNode,
  ContinueNode,
  BreakNode,
  IfNode,
  ForNode,
  WhileNode,
  IndexAccessNode,
} from "../parser/nodes";
import { getAttribute } from "../utils";
import Context from "./Context";
import RuntimeResult from "./RuntimeResult";
import Number from "./Number";
import { TokenTypes } from "../lexer/Token";
import { RuntimeError } from "../errors";
import Function from "./Function";
import String from "./String";
import List from "./List";

class Interpreter {
  constructor() {}

  /**
   * @param {Node} node
   * @param {Context} context
   */
  visit(node, context) {
    let methodName = `visit_${node.constructor.name}`;
    let method = getAttribute(this, methodName, this.noVisitMethod);
    return method(node, context);
  }

  /**
   * @param {Node} node
   * @param {Context} context
   */
  noVisitMethod(node, context) {
    throw new Error(`No visit_${node.name} method defined`);
  }

  /**
   * @param {VarAccessNode} node
   * @param {Context} context
   */
  visit_VarAccessNode(node, context) {
    let response = new RuntimeResult();
    let varName = node.varNameToken.value;
    let value = context.symbolTable.get(varName);
    if (!value)
      return response.failure(
        new RuntimeError(
          node.positionStart,
          node.positionEnd,
          `'${varName}' is not defined`,
          context
        )
      );

    value = value
      .copy()
      .setPosition(node.positionStart, node.positionEnd)
      .setContext(context);
    return response.success(value);
  }

  /**
   * @param {VarAssignNode} node
   * @param {Context} context
   */
  visit_VarAssignNode(node, context) {
    let response = new RuntimeResult();
    let varName = node.varNameToken.value;
    let value = response.register(this.visit(node.valueNode, context));
    if (response.shouldReturn()) return response;

    context.symbolTable.set(varName, value);
    return response.success(value);
  }

  /**
   * @param {IndexAccessNode} node
   * @param {Context} context
   */
  visit_IndexAccessNode(node, context) {
    let response = new RuntimeResult();

    let VarAccessNode = response.register(
      this.visit(node.VarAccessNode, context)
    );
    if (response.shouldReturn()) return response;

    let index = response.register(this.visit(node.indexValueNode, context));
    if (response.shouldReturn()) return response;

    let { result, error } = VarAccessNode.getIndex(index);
    if (error) return response.failure(error);
    return response.success(
      result.setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {NumberNode} node
   * @param {Context} context
   */
  visit_NumberNode(node, context) {
    return new RuntimeResult().success(
      new Number(node.token.value)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {StringNode} node
   * @param {Context} context
   */
  visit_StringNode(node, context) {
    return new RuntimeResult().success(
      new String(node.token.value)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {ListNode} node
   * @param {Context} context
   */
  visit_ListNode(node, context) {
    let response = new RuntimeResult();
    let elements = [];

    for (let i = 0; i < node.elements.length; i++) {
      let element = node.elements[i];
      elements.push(response.register(this.visit(element, context)));
      if (response.shouldReturn()) return response;
    }

    return response.success(
      new List(elements)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {BinOpNode} node
   * @param {Context} context
   */
  visit_BinOpNode(node, context) {
    let response = new RuntimeResult();
    let left = response.register(this.visit(node.leftNode, context));
    if (response.shouldReturn()) return response;
    let right = response.register(this.visit(node.rightNode, context));
    if (response.shouldReturn()) return response;

    if (node.operationToken.type == TokenTypes.PLUS) {
      let { result, error } = left.addedTo(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.MINUS) {
      let { result, error } = left.subbedBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.MUL) {
      let { result, error } = left.multedBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.DIV) {
      let { result, error } = left.diviedBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.POW) {
      let { result, error } = left.powerdBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.MOD) {
      let { result, error } = left.moddedBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.EE) {
      let { result, error } = left.getComparisonEq(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.NE) {
      let { result, error } = left.getComparisonNe(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.LT) {
      let { result, error } = left.getComparisonLt(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.GT) {
      let { result, error } = left.getComparisonGt(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.LTE) {
      let { result, error } = left.getComparisonLte(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.GTE) {
      let { result, error } = left.getComparisonGte(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.matches(TokenTypes.KEYWORD, "and")) {
      let { result, error } = left.andedBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.matches(TokenTypes.KEYWORD, "or")) {
      let { result, error } = left.oredBy(right);
      if (error) return response.failure(error);
      return response.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    }

    // if(error) return response.failure(error);
    // return response.success(result.setPosition(node.positionStart, node.positionEnd));
  }

  /**
   * @param {UnaryOpNode} node
   * @param {Context} context
   */
  visit_UnaryOpNode(node, context) {
    let response = new RuntimeResult();
    let number = response.register(this.visit(node.node, context));
    if (response.shouldReturn()) return response;

    if (node.operationToken.type === TokenTypes.MINUS) {
      let { result, error } = number.multedBy(new Number(-1));
      if (error) return response.failure(error);
      return response.success(result);
    } else if (node.operationToken.matches(TokenTypes.KEYWORD, "not")) {
      let { result, error } = number.notted();
      if (error) return response.failure(error);
      return response.success(result);
    }

    return response.success(Number.null);
  }

  /**
   *
   * @param {IfNode} node
   * @param {Context} context
   */
  visit_IfNode(node, context) {
    let response = new RuntimeResult();

    for (let i = 0; i < node.cases.length; i++) {
      let condition = node.cases[i][0];
      let expr = node.cases[i][1];
      let shouldReturnNull = node.cases[i][2];

      let conditionValue = response.register(this.visit(condition, context));
      if (response.shouldReturn()) return response;

      if (conditionValue.isTrue()) {
        let exprValue = response.register(this.visit(expr, context));
        if (response.shouldReturn()) return response;
        return response.success(shouldReturnNull ? Number.null : exprValue);
      }
    }

    if (node.elseCase) {
      let expr = node.elseCase[0];
      let shouldReturnNull = node.elseCase[1];
      let exprValue = response.register(this.visit(expr, context));
      if (response.shouldReturn()) return response;
      return response.success(shouldReturnNull ? Number.null : exprValue);
    }

    return response.success(Number.null);
  }

  /**
   * @param {ForNode} node
   * @param {Context} context
   */
  visit_ForNode(node, context) {
    let response = new RuntimeResult();
    let elements = [];
    let startValue, endValue, stepValue;
    let executions = 0;

    startValue = response.register(this.visit(node.startValueNode, context));
    if (response.shouldReturn()) return response;

    endValue = response.register(this.visit(node.endValueNode, context));
    if (response.shouldReturn()) return response;

    if (node.stepValueNode) {
      stepValue = response.register(this.visit(node.stepValueNode, context));
      if (response.shouldReturn()) return response;
    } else {
      stepValue = new Number(1);
    }

    let i = startValue.value;

    if (stepValue.value >= 0) {
      var condition = () => i < endValue.value;
    } else {
      var condition = () => i > endValue.value;
    }

    while (condition()) {
      context.symbolTable.set(node.varNameToken.value, new Number(i));
      i += stepValue.value;

      let element = response.register(this.visit(node.bodyNode, context));
      if (
        response.shouldReturn() &&
        response.loopShouldBreak == false &&
        response.loopShouldContinue == false
      )
        return response;

      if (response.loopShouldContinue) continue;
      if (response.loopShouldBreak) break;

      elements.push(element);
    }

    return response.success(
      node.shouldReturnNull
        ? Number.null
        : new List(elements).setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {WhileNode} node
   * @param {Context} context
   */
  visit_WhileNode(node, context) {
    let response = new RuntimeResult();
    let elements = [];
    let executions = 0;

    while (true) {
      let condition = response.register(
        this.visit(node.conditionNode, context)
      );
      if (response.shouldReturn()) return response;
      if (!condition.isTrue()) break;

      if (executions > 5000) {
        return response.failure(
          new RuntimeError(
            node.positionStart,
            node.positionEnd,
            `Loop iteration limit exceeded(5000).`,
            context
          )
        );
      }

      let element = response.register(this.visit(node.bodyNode, context));
      if (
        response.shouldReturn() &&
        response.loopShouldBreak == false &&
        response.loopShouldContinue == false
      )
        return response;

      if (response.loopShouldContinue) continue;
      if (response.loopShouldBreak) break;

      elements.push(element);
      executions++;
    }

    return response.success(
      node.shouldReturnNull
        ? Number.null
        : new List(elements).setPosition(node.positionStart, node.positionEnd)
    );
  }

  /**
   * @param {ReturnNode} node
   * @param {Context} context
   */
  visit_ReturnNode(node, context) {
    let response = new RuntimeResult();

    if (node.nodeToReturn) {
      let value = response.register(this.visit(node.nodeToReturn, context));
      if (response.shouldReturn()) return response;
      return response.successReturn(value);
    }

    return response.successReturn(Number.null);
  }

  /**
   * @param {ContinueNode} node
   * @param {Context} context
   */
  visit_ContinueNode(node, context) {
    return new RuntimeResult().successContinue();
  }

  /**
   * @param {BreakNode} node
   * @param {Context} context
   */
  visit_BreakNode(node, context) {
    return new RuntimeResult().successBreak();
  }

  /**
   * @param {PassNode} node
   * @param {Context} context
   */
  visit_PassNode(node, context) {
    return new RuntimeResult().successPass();
  }

  /**
   * @param {FuncDefNode} node
   * @param {Context} context
   */
  visit_FuncDefNode(node, context) {
    let response = new RuntimeResult();
    let funcName = node.varNameToken ? node.varNameToken.value : null;
    let bodyNode = node.bodyNode;
    let argNames = [];
    node.argNameTokens.forEach((argName) => {
      argNames.push(argName.value);
    });
    let funcValue = new Function(
      funcName,
      bodyNode,
      argNames,
      node.shouldAutoReturn
    )
      .setContext(context)
      .setPosition(node.positionStart, node.positionEnd);

    if (node.varNameToken) {
      context.symbolTable.set(funcName, funcValue);
    }

    return response.success(funcValue);
  }

  /**
   * @param {CallNode} node
   * @param {Context} context
   */
  visit_CallNode(node, context) {
    let response = new RuntimeResult();
    let args = [];
    let valueToCall = response.register(this.visit(node.nodeToCall, context));
    if (response.shouldReturn()) return response;
    valueToCall = valueToCall
      .copy()
      .setPosition(node.positionStart, node.positionEnd);

    for (let i = 0; i < node.argNodes.length; i++) {
      let argNode = node.argNodes[i];
      args.push(response.register(this.visit(argNode, context)));
      if (response.shouldReturn()) return response;
    }
    let returnValue = response.register(valueToCall.execute(this, args));
    if (response.shouldReturn()) return response;
    returnValue = returnValue
      .copy()
      .setPosition(node.positionStart, node.positionEnd)
      .setContext(context);
    return response.success(returnValue);
  }
}

export default Interpreter;
