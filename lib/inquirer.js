const inquirer = require("inquirer");
const files = require("./files");

const askGithubCredentials = () => {
    const questions = [
        {
            name: "username",
            type: "input",
            message: "Enter your Github username or email address:",
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return "Please enter your username or email-address"
                }
            }
        },
        {
            name: "password",
            type: "password",
            message: "Enter your password:",
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return "Please enter your password."
                }
            }
        }
    ];
    return inquirer.prompt(questions);
};

const askRepoDetails = () => {
    const argv = require("minimist")(process.argv.slice(2));

    const questions = [
        {
            type: "input",
            name: "name",
            message: "Enter a name for the repository:",
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return "Please enter a name for the reposity"
                }
            }
        },
        {
            type: "input",
            name: "description",
            default: argv._[1] || null,
            message: "Optionally enter a description of the project",
        },
        {
            type: "list",
            name: "visibility",
            message: "Public or private",
            choices: ["public", "private"],
            default: "public"
        }
    ];
    return inquirer.prompt(questions);
};

const askIgnoreFiles = (filelist) => {
    const questions = [
        {
            type: "checkbox",
            name: "ignore",
            message: "Select the files and/or folders you wish to ignore",
            choiches: filelist,
            default: ["node_modules", "bower_component"]
        }
    ];
    return inquirer.prompt(questions);
};

module.exports = {
    askGithubCredentials,
    askRepoDetails,
    askIgnoreFiles,
};