const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const compat = new FlatCompat();

module.exports = [
  js.configs.recommended,
  ...compat.extends("plugin:prettier/recommended"),
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];