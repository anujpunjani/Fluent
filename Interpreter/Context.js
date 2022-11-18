class Context {
  constructor(displayName, parent = null, parentEntryPosition = null) {
    this.displayName = displayName;
    this.parent = parent;
    this.parentEntryPosition = parentEntryPosition;
    // this.symbolTable = null;
  }
}

module.exports = Context;
