/**
 * Serialize a JSON-LD graph for injection into <script type="application/ld+json">.
 *
 * JSON.stringify leaves `<` alone, so a closing script tag anywhere in the data
 * would end the block early and turn the rest into markup. Escaping it as a \u
 * sequence keeps the JSON identical to any parser while staying inert to the HTML
 * tokenizer. U+2028/U+2029 get the same treatment - they are literal line
 * terminators in JavaScript but legal inside a JSON string.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    /[\u003c\u2028\u2029]/g,
    (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}
