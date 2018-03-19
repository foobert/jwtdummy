module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    "no-console": "off"
  }
};
