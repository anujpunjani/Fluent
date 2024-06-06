import React, { useEffect, useRef } from "react";
import "./terminal.css";

const Terminal = ({ output, isSuccess }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (output.length) {
      setTimeout(() => terminalRef.current?.scrollIntoView(false), 100);
    }
  }, [output]);

  return (
    <div
      ref={terminalRef}
      className={`${
        isSuccess !== null ? "terminal" : "terminal-collapsed"
      } bg-black text-white my-6`}
    >
      {isSuccess !== null && !isSuccess ? (
        <>
          <div className="text-red-700 output opacity-0">Error!!!</div>
          <div
            dangerouslySetInnerHTML={{
              __html: output
                .replace(/</g, "&lt;") // Escape less than sign
                .replace(/>/g, "&gt;") // Escape greater than sign
                .replace(/(?:\r\n|\r|\n)+/g, "<br/>") // Replace multiple newlines with a single <br> tag
                .replace(/ {2}/g, "&emsp;"), // Replace double spaces with non-breaking spaces
            }}
          ></div>
        </>
      ) : (
        <>
          <div className="text-green-700 output opacity-0">Success!!!</div>
          {output.map((line, i) => {
            return (
              <div key={i} className={`output opacity-0`}>
                &gt; {line.value}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Terminal;
