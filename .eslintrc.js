module.exports = {
  extends: ["next", "next/core-web-vitals", "prettier"],
  plugins: ["@typescript-eslint"],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "no-shadow": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "react/no-children-prop": "warn",
    "semi": ["error", "never"],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
        disallowTypeAnnotations: false,
      },
    ],
    "import/order": ["warn", {
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true,
      },
      "newlines-between": "always",
      "distinctGroup": false,
      "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
      "pathGroupsExcludedImportTypes": [],
      "pathGroups": [
        {
          "pattern": "react",
          "group": "external",
          "position": "before",
        },
        {
          "pattern": "{@/ui,@/ui/**,@/components,@/components/**}",
          "group": "internal",
          "position": "after",
        },
        {
          "pattern": "@/**",
          "group": "internal",
        },
        {
          "pattern": "../**",
          "group": "parent",
          "position": "before",
        },
        {
          "pattern": "{./,.}",
          "group": "index",
          "position": "after",
        },
      ],
    }],
    "quotes": ["error", "single"],
    "react-hooks/exhaustive-deps": "error",
    "react/no-unescaped-entities": "off",
  },
}
