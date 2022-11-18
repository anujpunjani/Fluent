const { TokenTypes } = require("../Lexer/Token");
const { getAttribute } = require("../utils");
const Number = require("./Number");
const RunTimeResult = require("./RunTimeResult");

class Interpreter {
  visit(node, context) {
    let methodName = "visit_" + node.constructor.name;
    let method = getAttribute(this, methodName, this.noVisitMethod);
    return method(node, context);
  }

  noVisitMethod(node, context) {
    throw new Error(`No visit_${node.constructor.name} method defined`);
  }

  visit_NumberNode(node, context) {
    return new RunTimeResult().success(
      new Number(node.token.value)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd)
    );
  }

  visit_BinOpNode(node, context) {
    let res = new RunTimeResult();
    let left = res.register(this.visit(node.leftNode, context));
    if (res.error) return res;
    let right = res.register(this.visit(node.rightNode, context));
    if (res.error) return res;

    if (node.operationToken.type == TokenTypes.PLUS) {
      let { result, error } = left.addedTo(right);
      if (error) return res.failure(error);
      return res.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.MINUS) {
      let { result, error } = left.subbedBy(right);
      if (error) return res.failure(error);
      return res.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.MUL) {
      let { result, error } = left.multedBy(right);
      if (error) return res.failure(error);
      return res.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    } else if (node.operationToken.type == TokenTypes.DIV) {
      let { result, error } = left.divedBy(right);
      if (error) return res.failure(error);
      return res.success(
        result.setPosition(node.positionStart, node.positionEnd)
      );
    }

    //! return result.setPosition(node.positionStart, node.positionEnd);
  }
  visit_UnaryOpNode(node, context) {
    let res = new RunTimeResult();
    let number = res.register(this.visit(node.node, context));
    if (res.error) return res;
    if (node.operationToken == TokenTypes.MINUS) {
      number = number.multedBy(new Number(-1));
    }
    if (number.error) return res.failure(number.error);
    return res.success(
      number.result
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd)
    );
  }
}

module.exports = Interpreter;
