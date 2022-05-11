module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "scope-enum": [2, "always", ["docs", "root", "core", "helm"]],
        "scope-empty": [2, "never"],
    },
};
