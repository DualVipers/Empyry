module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "scope-enum": [2, "always", ["root", "core"]],
        "scope-empty": [2, "never"],
    },
};
