import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import styles from "./codeeditor.module.scss";
import CopyToClipboard from "../../CopyToClipboard/CopyToClipboard";

import { FluentLangSyntax } from "../../utils/FluentLangSyntax";

import "prismjs/themes/prism-tomorrow.css";

const CodeEditor = ({ code, setCode }) => {
  const highlightWithLineNumbers = (input) =>
    highlight(input, FluentLangSyntax, "FluentLang")
      .split("\n")
      //   .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
      .map(
        (line, i) =>
          `<span class="absolute left-0 text-right text-[#8a8a8a] w-[40px]">${
            i + 1
          }</span>${line}`
      )
      .join("\n");

  return (
    <div className={styles.playgroundEditor}>
      <div className={styles.editorContainer}>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlightWithLineNumbers(code)}
          padding={10}
          textareaClassName={styles.codeArea}
          className={styles.editor}
          id="codeEditor"
          style={{
            fontFamily: "monospace",
            fontSize: 16,
          }}
        />
      </div>
      <CopyToClipboard text={code} />
    </div>
  );
};

export default CodeEditor;
