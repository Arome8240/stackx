const base = require("./base.cjs");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  env: {
    ...base.env,
    reactnative: true
  },
  plugins: [...base.plugins, "react", "react-hooks"],
  extends: [
    ...base.extends,
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  }
};


