import { ClassValue } from "classnames/types";
import classNames from "classnames";
import { createClassifier } from "./rules";

/** Create cascader
 * @param prefix: Optional classname prefix
 * @returns Cascader function
 */
export function createTailwindCascader({ prefix }: { prefix?: string } = {}) {
  const classify = createClassifier(prefix);

  /** TailwindCSS cascader
   * Like Classnames, but overrides according to TailwindCSS cascade groups
   */
  return function twcx(...args: ClassValue[]) {
    const memo: Record<string, string> = {};

    for (const className of classNames(...args).split(" ")) {
      const result = classify(className);
      if (!result) {
        // prefix doesn't match, no group
        memo[className] = className;
      } else {
        const { variant, group, overrides } = result;
        for (const ov of overrides) {
          delete memo[`${variant}${ov}`];
        }

        memo[`${variant}${group}`] = className;
      }
    }

    return Object.values(memo).join(" ");
  };
}

/** TailwindCSS cascader
 * Like Classnames, but overrides according to TailwindCSS cascade groups
 */
export const twCascade = createTailwindCascader();
