module.exports = {
	root: true,
	extends: ["next", "next/core-web-vitals", "prettier"],
	plugins: ["@typescript-eslint"],
	settings: {
		next: {
			rootDir: ".",
		},
	},
	parserOptions: {
		project: ["tsconfig.json"],
	},
	ignorePatterns: [".eslintrc.js"],
	rules: {
    "@typescript-eslint/consistent-type-imports": ["warn", {
      disallowTypeAnnotations: false,
      fixStyle: "inline-type-imports",
      prefer: "type-imports"
    }],
    "@typescript-eslint/no-shadow": "warn",
    "comma-dangle": ["error", "always-multiline"],
    "import/order": ["warn", {
      alphabetize: {
        caseInsensitive: true,
        order: "asc"
      },
      distinctGroup: false,
      groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
      "newlines-between": "always",
      pathGroups: [{
        group: "external",
        pattern: "react",
        position: "before"
      }, {
        group: "internal",
        pattern: "{@/ui,@/ui/**,@/components,@/components/**}",
        position: "after"
      }, {
        group: "internal",
        pattern: "@/**"
      }, {
        group: "parent",
        pattern: "../**",
        position: "before"
      }, {
        group: "index",
        pattern: "{./,.}",
        position: "after"
      }],
      pathGroupsExcludedImportTypes: []
    }],
    "indent": ["error", "tab"],
    "no-shadow": "warn",
    "quotes": ["warn", "double", {
      avoidEscape: true
    }],
    "react-hooks/exhaustive-deps": "error",
    "react/no-children-prop": "warn",
    "react/no-unescaped-entities": "off",
    "semi": ["error", "never"]
  },
}
