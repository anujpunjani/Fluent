import Position from "./lexer/Position";

/**
 * @param {string} filecontent
 * @param {Position} positionStart
 * @param {Position} positionEnd
 * @returns {string}
 */

function stringWithArrows(filecontent, positionStart, positionEnd) {
  let result = "";

  let indexStart = Math.max(
    filecontent.lastIndexOf("\n", positionStart.index),
    0
  );
  let indexEnd = filecontent.indexOf("\n", indexStart + 1);
  if (indexEnd < 0) indexEnd = filecontent.length;

  const lineCount = positionEnd.line - positionStart.line + 1;

  for (let i = 0; i < lineCount; i++) {
    const line = filecontent.slice(indexStart, indexEnd);
    const columnStart = i === 0 ? positionStart.column : 0;
    const columnEnd =
      i === lineCount - 1 ? positionEnd.column : line.length - 1;

    result += line + "\n";
    result += " ".repeat(columnStart);
    result += "^".repeat(columnEnd - columnStart);

    indexStart = indexEnd;
    indexEnd = filecontent.indexOf("\n", indexStart + 1);
    if (indexEnd < 0) indexEnd = filecontent.length;
  }

  return result;
}

function getAttribute(object, prop, deafultValue = null) {
  if (prop in object) {
    let val = object[prop];
    if (typeof val === "function") return val.bind(object);
    return val;
  }

  if (arguments.length > 2) return deafultValue;

  return new TypeError(`Object ${object} does not have property ${prop}`);
}

export { stringWithArrows, getAttribute };
