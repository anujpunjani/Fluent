class Position {
  constructor(index, line, column, fileName, fileContent) {
    this.index = index;
    this.line = line;
    this.column = column;
    this.fileName = fileName;
    this.fileContent = fileContent;
  }

  advance(currentChar = null) {
    this.index++;
    this.column++;

    if (currentChar == "\n") {
      this.line++;
      this.column = 0;
    }

    return this;
  }

  copy() {
    const copy = new Position(
      this.index,
      this.line,
      this.column,
      this.fileName,
      this.fileContent
    );

    return copy;
  }
}

module.exports = Position;
