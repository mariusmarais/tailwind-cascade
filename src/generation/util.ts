import { DefinitionNode, Override } from "./definitions";

export function toLookup(definitions: DefinitionNode<string[]>) {
  const memo: {
    [key: string]: string;
    [Override]: { [key: string]: string[] };
  } = { [Override]: {} };

  walk(definitions);

  return memo;

  function walk(obj: DefinitionNode<string[]>, prevKey = "") {
    for (const key of Object.keys(obj)) {
      const path = prevKey ? `${prevKey}.${key}` : key;
      const value = obj[key];

      if (Array.isArray(value)) {
        for (const className of value) {
          memo[className] = path;
        }
      } else {
        walk(value, path);
      }
    }

    const overrides = obj[Override];
    if (overrides) {
      for (const key of Object.keys(overrides)) {
        memo[Override][`${prevKey}.${key}`] = overrides[key].map(
          (o) => `${prevKey}.${o}`
        );
      }
    }
  }
}
