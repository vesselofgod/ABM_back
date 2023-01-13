module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  rules: {
    "no-console": "off",
    "no-debugger": "warn",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
