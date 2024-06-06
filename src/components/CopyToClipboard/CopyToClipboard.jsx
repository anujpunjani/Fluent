import React, { useState, useEffect, useRef } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import styles from "./copytoclipboard.module.scss";

const CopyToClipboard = ({ text }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  }, [copySuccess]);

  function copyToClipboard(e) {
    e.stopPropagation();
    if (text) {
      navigator.clipboard
        ?.writeText(text)
        .then(() => {
          setCopySuccess(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        className={
          "absolute text-4xl top-6 right-10 sm:top-4 sm:right-4 group-hover:flex items-center justify-center p-1 sm:p-2 border border-[#f0f6fc1a] rounded-md text-gray-400 bg-[#333] hover:bg-[#4d4d4d] cursor-pointer transition-all duration-100"
        }
        onClick={copyToClipboard}
      >
        {copySuccess ? (
          <>
            <LuCopyCheck />
            <span
              className={`absolute top-1/2 -translate-y-1/2 right-[calc(100%+8px)] p-1 rounded-md text-xl font-normal text-bhagwa-300 bg-[#666] border border-transparent
                ${styles.copiedText}`}
            >
              Copied!
            </span>
          </>
        ) : (
          <LuCopy />
        )}
      </button>
    </>
  );
};

export default CopyToClipboard;
