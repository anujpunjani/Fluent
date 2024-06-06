import Prism, { languages } from "prismjs";

export const FluentLangSyntax = {
  comment: [
    {
      pattern: /(^|[^:])#.*/,
      lookbehind: true,
      greedy: true,
    },
  ],
  string: {
    pattern: /(["'])(?:\\.|(?!\1)[^\\])*\1/,
    greedy: true,
  },
  keyword:
    /\b(?:and|or|not|if|else|elif|for|step|while|until|func|return|continue|break|pass)\b/,
  builtin:
    /\b(?:print|printReturn|input|isNumber|isList|isFunction|isString|abs|len)\b/,
  boolean: /\b(?:true|false)\b/,
  number: /(?:(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
  null: {
    pattern: /\bnull\b/,
  },
  operator:
    /[*/%^!=]=?|~|\+[=+]?|-[=-]?|=>|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
};

Prism.languages.FluentLang = FluentLangSyntax;
