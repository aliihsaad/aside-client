//The whole component is AI Generated including the css file for styling purposes :p 

import { useState } from "react";
import "./CodeBlock.css";

const KEYWORDS = new Set([
  "as", "async", "await", "break", "case", "catch", "class", "const", "continue",
  "default", "delete", "do", "else", "export", "extends", "false", "finally",
  "for", "from", "function", "if", "import", "in", "instanceof", "let", "new",
  "null", "of", "return", "static", "super", "switch", "this", "throw", "true",
  "try", "typeof", "undefined", "var", "void", "while", "with", "yield",
]);

const TOKEN_PATTERN =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][^>]*?>|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b)/g;

function tokenClass(token, source, endIndex) {
  if (token.startsWith("//") || token.startsWith("/*") || token.startsWith("<!--")) {
    return "token-comment";
  }
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    return "token-string";
  }
  if (token.startsWith("<")) return "token-tag";
  if (/^\d/.test(token)) return "token-number";
  if (KEYWORDS.has(token)) return "token-keyword";

  const remainder = source.slice(endIndex);
  if (/^\s*\(/.test(remainder)) return "token-function";
  if (/^\s*:/.test(remainder)) return "token-property";
  if (/^[A-Z]/.test(token)) return "token-type";
  return "";
}

function highlight(source) {
  const nodes = [];
  let cursor = 0;
  let key = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const index = match.index;
    const token = match[0];
    if (index > cursor) nodes.push(source.slice(cursor, index));

    const className = tokenClass(token, source, index + token.length);
    nodes.push(className ? <span className={className} key={key++}>{token}</span> : token);
    cursor = index + token.length;
  }

  if (cursor < source.length) nodes.push(source.slice(cursor));
  return nodes;
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const source = String(code ?? "");
  const normalizedLanguage = (language || "code").toLowerCase();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard needs https or localhost — fail quietly rather than alarm anyone
    }
  };

  return (
    <div className="code-block">
      <div className="code-head">
        <div className="code-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="code-language">{normalizedLanguage}</span>
        <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre><code className={`language-${normalizedLanguage}`}>{highlight(source)}</code></pre>
    </div>
  );
}

export default CodeBlock;
