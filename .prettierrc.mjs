/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  printWidth: 120,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
  tailwindStylesheet: "./src/global.css",
  tailwindFunctions: ["twMerge"],
};
