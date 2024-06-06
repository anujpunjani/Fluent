import React from "react";
import styles from "./input.module.scss";

const Input = ({ input, setInput }) => {
  return (
    <div className={`${styles.InputContainer} flex-none`}>
      <div className="flex">
        <div className={styles.LineNumbers}>
          {input.split("\n").map((_, index) => (
            <div key={index} className={styles.LineNumber}>
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          className={styles.InputEditor}
          placeholder="Enter input to program here. Each line is treated as seprate input."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          name="Input"
          id="InputBox"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default Input;
