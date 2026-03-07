const base = require("./base.cjs");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  env: {
    ...base.env,
    node: true
  },
  plugins: [...base.plugins, "@typescript-eslint"],
  parserOptions: {
    ...base.parserOptions,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  }
};


