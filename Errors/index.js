class FluentError {
  constructor(
    positionStart,
    positionEnd,
    errorName,
    details,
    position,
    fileName,
    fileContent
  ) {
    this.errorName = errorName;
    this.details = details;
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    this.position = position;
    this.fileName = fileName;
    this.fileContent = fileContent;
  }

  asError() {
    let result =
      this.errorName +
      ": " +
      this.details +
      "\n" +
      "File: " +
      this.positionStart.fileName +
      ", " +
      "line: " +
      (this.positionStart.line + 1) +
      "\n";

    return result;
  }
}

class IllegalCharacterError extends FluentError {
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, "Illegal Character", details); //parent class constructor is been called by super
  }
}

module.exports = { FluentError, IllegalCharacterError };
