import { FluentError } from "../errors";
import Value from "./Value";

class RuntimeResult {
  constructor() {
    this.reset();
  }

  reset() {
    /**
     * @type {Value}
     */
    this.value = null;

    /**
     * @type {FluentError}
     */
    this.error = null;

    this.functionReturnValue = null;
    this.loopShouldContinue = false;
    this.loopShouldBreak = false;
  }

  /**
   * @param {RuntimeResult} response
   * @returns {Value}
   */
  register(response) {
    this.error = response.error;
    this.functionReturnValue = response.functionReturnValue;
    this.loopShouldContinue = response.loopShouldContinue;
    this.loopShouldBreak = response.loopShouldBreak;
    return response.value;
  }

  /**
   * @param {Value} value
   * @returns {RuntimeResult}
   */
  success(value) {
    this.reset();
    this.value = value;
    return this;
  }

  successReturn(value) {
    this.reset();
    this.functionReturnValue = value;
    return this;
  }

  successContinue() {
    this.reset();
    this.loopShouldContinue = true;
    return this;
  }

  successBreak() {
    this.reset();
    this.loopShouldBreak = true;
    return this;
  }

  successPass() {
    this.reset();
    return this;
  }

  shouldReturn() {
    return (
      this.error ||
      this.functionReturnValue ||
      this.loopShouldContinue ||
      this.loopShouldBreak
    );
  }

  /**
   * @param {FluentError} error
   * @returns {RuntimeResult}
   */
  failure(error) {
    this.reset();
    this.error = error;
    return this;
  }
}

export default RuntimeResult;
