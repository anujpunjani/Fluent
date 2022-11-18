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

class InvalidSyntaxError extends FluentError {
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, "Invalid Syntax", details); //parent class constructor is been called by super
  }
}

class RunTimeError extends FluentError {
  constructor(positionStart, positionEnd, details, context) {
    super(positionStart, positionEnd, "RunTime Error", details); //parent class constructor is been called by super
    this.context = context;
  }
  asError() {
    let result = this.generateTraceback();
    result += this.errorName + ": " + this.details;
    result +=
      "\n" +
      stringWithArrows(
        this.positionStart.fileContent,
        this.positionStart,
        this.positionEnd
      );
    return result;
  }
  generateTraceback() {
    let result = "";
    let pos = this.positionStart;
    let ctx = this.context;
    while (ctx) {
      result =
        "  File " +
        pos.fileName +
        ", line " +
        (pos.line + 1) +
        ", in " +
        ctx.displayName +
        "\n" +
        result;

      pos = ctx.parentEntryPosition;
      ctx = ctx.parent;
    }
    return "Traceback (most recent call last):\n" + result;
  }
}

module.exports = {
  FluentError,
  IllegalCharacterError,
  InvalidSyntaxError,
  RunTimeError,
};
