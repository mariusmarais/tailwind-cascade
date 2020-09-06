import escapeRegExp from "escape-regex-string";

const {
  definitions: DEFINITIONS,
  overrides: OVERRIDES,
} = require("./generated-rules.json") as {
  definitions: Record<string, string>;
  overrides: Record<string, string[]>;
};

export function createClassifier(prefix: string = "") {
  const extractRegex = new RegExp(
    `^([^:]+:)?${escapeRegExp(prefix || "")}(.*)$`
  );

  return function classify(
    className: string
  ): { variant: string; group: string; overrides: string[] } | undefined {
    const m = extractRegex.exec(className);
    if (!m) {
      return undefined;
    }

    const [, variant = "", key] = m;
    const group = DEFINITIONS[key];

    if (!group) {
      return undefined;
    }

    const overrides = OVERRIDES[group] || [];

    return { variant, group, overrides };
  };
}
