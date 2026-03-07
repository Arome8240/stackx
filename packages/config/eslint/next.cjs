const base = require("./base.cjs");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...base.extends,
    "next/core-web-vitals"
  ],
  env: {
    ...base.env,
    browser: true
  }
};


