module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "subject-case": [
            2,
            "always",
            ["sentence-case", "start-case", "lower-case"],
        ],
        "scope-enum": [
            2,
            "always",
            ["root", "core"],
        ],
        "scope-empty": [
            2,
            "never",
        ],
    },
};