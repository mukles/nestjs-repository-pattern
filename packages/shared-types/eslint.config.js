import { libraryConfig } from "@repo/eslint-config/library";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
  ...libraryConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
];
