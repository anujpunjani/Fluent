import React, { useEffect, useState } from "react";
import styles from "./playground.module.scss";
import CodeEditor from "./CodeEditor/CodeEditor";
import SectionHeader from "../utils/SectionHeader";
import { FaPlay } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { interpret } from "./Init";
import Terminal from "./Terminal/Terminal";
import Input from "./Input/Input";

const initialCode = `
# Swap to numbers

a = 28;
b = 11;

temp = a;
a = b;
b = temp;

print(a);
print(b);
`;

const Playground = () => {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [output, setOutput] = useState([]);

  const executeCode = () => {
    let orignalConsoleLog = console.log;
    const outputList = [];
    let isExecusionSuccess = true;
    console.log = function (...args) {
      outputList.push({ value: args.join("\n"), isError: false });
    };
    let { result, error } = interpret(code, input.split("\n"));
    if (error) {
      isExecusionSuccess = false;
      setOutput(error.asError());
    } else setOutput(outputList);

    setIsSuccess(isExecusionSuccess);
    console.log = orignalConsoleLog;
  };

  const clearCode = () => {
    setCode("");
    setInput("");
    setIsSuccess(null);
    setOutput([]);
  };

  return (
    <section id="playground" className="section-wrapper">
      <SectionHeader title={"Playground"} direction="left" />
      <div className={styles.buttons}>
        <button
          onClick={executeCode}
          disabled={!code}
          className={`${styles.button} border-solid border-2 border-[#0c790c] text-[#0c790c] hover:text-[var(--text)] hover:bg-green-600 hover:border-black`}
        >
          <FaPlay /> Run
        </button>
        <button
          onClick={clearCode}
          className={`${styles.button} border-solid border-2 border-[#cb4545] text-[#cb4545] hover:text-[var(--text)] hover:bg-red-400 hover:border-black`}
        >
          <IoIosCloseCircle /> Clear
        </button>
      </div>
      <div className="flex max-md:flex-col">
        <CodeEditor code={code} setCode={setCode} />
        <Input input={input} setInput={setInput} />
      </div>
      <Terminal output={output} isSuccess={isSuccess} />
    </section>
  );
};

export { Playground };
