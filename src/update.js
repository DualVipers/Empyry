const { Select, Toggle } = require("enquirer");
const semver = require("semver");

const updater = async (current_version) => {
    const upgrade_prompt = new Select({
        name: "upgrade-type",
        message: "Select Version Mode",
        choices: [
            "major",
            "premajor",
            "minor",
            "preminor",
            "patch",
            "prepatch",
            "prerelease",
        ],
    });

    const upgrade_type = await upgrade_prompt.run();

    const new_version = semver.inc(
        semver.coerce(current_version),
        upgrade_type,
        "beta"
    );

    console.log(`New Version: ${new_version}`);

    const okay_prompt = new Toggle({
        message: "Build Version?",
        enabled: "Yes",
        disabled: "No",
    });

    if (!(await okay_prompt.run())) {
        console.error("Quitting");
        return;
    }

    console.log("");
    console.log("Version Up");
    try {
        await os_func("yarn", [
            "lerna",
            "version",
            new_version,
            "--no-push",
            "--no-git-tag-version",
        ]);
    } catch {
        console.log("");
        console.error("Could Not Increase Version");
        return;
    }
    console.log("");

    console.log("");
    console.log("Build Core");
    try {
        await os_func("docker", ["build", ".", "--tag", "empyry:latest"]);
    } catch {
        console.log("");
        console.error("Could Not Build Core");
        return;
    }
    console.log("");

    const publish_prompt = new Toggle({
        message: "Publish Version? (Make sure you have committed all changes)",
        enabled: "Yes",
        disabled: "No",
    });

    if (!(await publish_prompt.run())) {
        console.error("Quitting");
        return;
    }

    console.log("");
    console.log("Publish Plugins");
    try {
        if (semver.prerelease(new_version)) {
            await os_func("yarn", [
                "lerna",
                "publish",
                "from-package",
                "--no-git-reset",
                "--dist-tag",
                "beta",
            ]);
        } else {
            await os_func("yarn", [
                "lerna",
                "publish",
                "from-package",
                "--no-git-reset",
            ]);
        }
    } catch {
        console.log("");
        console.error("Could Not Publish Plugins");
        return;
    }
    console.log("");

    console.log("");
    console.log("Publish Core");
    try {
        if (semver.prerelease(new_version)) {
            await os_func("docker", [
                "image",
                "tag",
                "empyry:latest",
                "dualvs/empyry:beta",
            ]);
            await os_func("docker", ["image", "push", "dualvs/empyry:beta"]);
        } else {
            const version_semver = semver.parse(new_version);

            await os_func("docker", [
                "image",
                "tag",
                "empyry:latest",
                "dualvs/empyry:latest",
            ]);
            await os_func("docker", [
                "image",
                "tag",
                "empyry:latest",
                `dualvs/empyry:v${version_semver.major}`,
            ]);
            await os_func("docker", [
                "image",
                "tag",
                "empyry:latest",
                `dualvs/empyry:v${version_semver.major}.${version_semver.minor}`,
            ]);
            await os_func("docker", [
                "image",
                "tag",
                "empyry:latest",
                `dualvs/empyry:v${version_semver.major}.${version_semver.minor}.${version_semver.patch}`,
            ]);

            await os_func("docker", ["image", "push", "dualvs/empyry:latest"]);
            await os_func("docker", [
                "image",
                "push",
                `dualvs/empyry:v${version_semver.major}`,
            ]);
            await os_func("docker", [
                "image",
                "push",
                `dualvs/empyry:v${version_semver.major}.${version_semver.minor}`,
            ]);
            await os_func("docker", [
                "image",
                "push",
                `dualvs/empyry:v${version_semver.major}.${version_semver.minor}.${version_semver.patch}`,
            ]);
        }
    } catch {
        console.log("");
        console.error("Could Not Publish Core");
        return;
    }
    console.log("");
};

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

console.log(
    "WARNING: Make sure you have run setup, logged into docker + npm, and everything is installed!"
);

const current_version = JSON.parse(
    fs.readFileSync(path.join(__filename, "../../package.json"))
).version;

console.log(`Current Version: ${current_version}`);

updater(current_version);

const os_func = (cmd, args) => {
    const process = spawn(cmd, args, { stdio: "inherit" });

    return new Promise((resolve, reject) => {
        process.on("error", (err) => {
            console.error("Process Error:", err);
            reject();
        });

        process.on("exit", (code) => {
            if (code == 0) {
                resolve();
            } else {
                console.error("Process Error Code:", code);
                reject();
            }
        });
    });
};
