import { resolve } from "path";
import { writeFileSync } from "fs";
import { toLookup } from "./util";
import { GroupDefinitions, Override } from "./definitions";

const LOOKUP = toLookup(GroupDefinitions);

writeFileSync(
  resolve(__dirname, "../lib/generated-rules.json"),
  JSON.stringify(
    {
      definitions: LOOKUP, // Override symbol skipped automatically
      overrides: LOOKUP[Override],
    },
    null,
    2
  )
);
