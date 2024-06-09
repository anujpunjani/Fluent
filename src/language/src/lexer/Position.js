class Position {
  /**
   * @param {number} index
   * @param {number} line
   * @param {number} column
   * @param {string} filename
   * @param {string} filecontent
   */
  constructor(index, line, column, filename, filecontent) {
    this.index = index;
    this.line = line;
    this.column = column;
    this.filename = filename;
    this.filecontent = filecontent;
  }

  /**
   * @param {string} currentChar
   * @returns {Position}
   */
  advance(currentChar = null) {
    this.index++;
    this.column++;

    if (currentChar == "\n") {
      this.line++;
      this.column = 0;
    }

    return this;
  }

  /**
   * @returns {Position}
   */
  copy() {
    return new Position(
      this.index,
      this.line,
      this.column,
      this.filename,
      this.filecontent
    );
  }
}

export default Position;
