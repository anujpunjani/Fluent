import Position from "../../lexer/Position";

class Node {
  /**
   * @type {Position}
   */
  positionStart = null;
  /**
   * @type {Position}
   */
  positionEnd = null;
  name = "";
}

export default Node;
