import React from "react";
import { highlight } from "prismjs";
import { FluentLangSyntax } from "../utils/FluentLangSyntax";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";

const Snippet = ({ name, description, code }) => {
  return (
    <div>
      <div className="border-t-2 border-[var(--text)] pt-4">
        <div className="font-medium text-3xl text-[var(--text)]">{name}</div>
        <div className="mt-2 text-2xl text-[var(--text)]">{description}</div>
        <div className="relative">
          <div
            className="bg-[#333] py-2 px-5 my-6 text-2xl text-white font-[monospace]"
            dangerouslySetInnerHTML={{
              __html: highlight(code, FluentLangSyntax, "FluentLang")
                .replace(new RegExp("\n", "g"), "<br/>")
                .replace(new RegExp("  ", "g"), "&emsp;"),
            }}
          />
          <CopyToClipboard text={code} />
        </div>
      </div>
    </div>
  );
};

export default Snippet;
