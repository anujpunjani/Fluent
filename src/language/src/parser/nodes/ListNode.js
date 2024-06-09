import Node from "./Node";

class ListNode extends Node {
  constructor(elements, positionStart, positionEnd) {
    super();
    this.elements = elements;
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;

    this.name = "ListNode";
  }

  toString() {
    return `([${this.elements.join(", ")}])`;
  }
}

export default ListNode;
