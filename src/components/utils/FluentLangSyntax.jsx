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
    /\b(?:and|or|not|if|then|else|elif|for|to|step|while|until|func|return|continue|break|pass)\b/,
  builtin:
    /\b(?:print|printReturn|input|clear|isNumber|isList|isFunction|isString|concat|len|run)\b/,
  boolean: /\b(?:true|false)\b/,
  number: /(?:(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
  null: {
    pattern: /\bnull\b/,
  },
  operator:
    /[*/%^!=]=?|~|\+[=+]?|-[=-]?|=>|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
};

Prism.languages.FluentLang = FluentLangSyntax;
