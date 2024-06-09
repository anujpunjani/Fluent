import { FluentError } from "../errors";

class ParseResult {
  constructor() {
    /**
     * @type {FluentError}
     */
    this.error = null;
    /**
     * @type {Node}
     */
    this.node = null;
    this.lastRegisteredAdvanceCount = 0;
    this.advanceCount = 0;
    this.toReverseCount = 0;
  }

  registerAdvancement() {
    this.lastRegisteredAdvanceCount = 1;
    this.advanceCount++;
  }
  /**
   * @param {ParseResult} response
   * @returns {Node}
   */
  register(response) {
    this.lastRegisteredAdvanceCount = response.advanceCount;
    this.advanceCount += response.advanceCount;
    if (response.error) this.error = response.error;
    return response.node;
  }
  /**
   * @param {ParseResult} response
   * @returns {Node}
   */
  tryRegister(response) {
    if (response.error) {
      this.toReverseCount = response.advanceCount;
      return null;
    }
    return this.register(response);
  }

  /**
   * @param {Node} node
   * @returns {ParseResult}
   */
  success(node) {
    this.node = node;
    return this;
  }

  /**
   * @param {FluentError} error
   * @returns {ParseResult}
   */
  failure(error) {
    if (!this.error || this.advanceCount == 0) this.error = error;
    return this;
  }
}

export default ParseResult;
