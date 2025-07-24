module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    "no-console": "warn",
    "dot-notation": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "multiline-ternary": "off",
    "no-return-await": "off",
    "no-shadow": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-curly-brace-presence": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [".jsx", ".tsx"]
      }
    ],
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-wrap-multilines": "off",
    // Cannot use `Component.displayName` pattern on class components in TS.
    "react/static-property-placement": "off",
    "space-before-function-paren": "off",
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": ["warn", {
      groups: [
        ["^react"],
        ["^next"],
        ["^@?\\w"],
        ["^recoil"],
        ["@/atoms/(.*)"],
        ["@/(.*)"],
        ["^[./]"]
      ]
    }],
    "@typescript-eslint/no-explicit-any": "off",
    "unused-imports/no-unused-imports": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": [
      "off", {
        "additionalHooks": "(useRecoilCallback|useRecoilTransaction_UNSTABLE)"
      }
    ],

    // Require or disallow a space immediately following the // or /* in a comment
    // https://eslint.org/docs/rules/spaced-comment
    "spaced-comment": [
      "error",
      "always",
      {
        "line": {
          "exceptions": ["-", "+"],
          "markers": ["=", "!", "#region", "#endregion", "/"] // space here to support sprockets directives and typescript reference comments
        },
        "block": {
          "exceptions": ["-", "+"],
          "markers": ["=", "!", "#region", "#endregion", ":", "::"],
          // space here to support sprockets directives and flow comment types
          "balanced": true
        }
      }
    ],
    // "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/space-before-function-paren": "off"
  },
  globals: {
    React: true,
    JSX: true,
  },
};
