const { Octokit } = require("@octokit/rest");
const Configstore = require("configstore");
const pkg = require("../package.json");
const _ = require("lodash");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const chalk = require("chalk");

const inquirer = require("./inquirer");
const conf = new Configstore(pkg.name);

// function that allows other libs to access octokit(GitHub) functions
const getInstance = () => {
    return octokit;
};

const githubAuth = (token) => {
    Octokit.authenticate({
        type: "oauth",
        token: token,
    });
};

// function that checks whether we’ve already got an access token
const getStoredGithubToken = () => {
    return conf.get("github.token");
};

const setGithubCredentials = async () => {
    const credentials = await inquirer.askGithubCredentials();
    Octokit.authenticate(
        _.extend({
            type: "basic",
        },
        credentials
        )
    );
};

const registerNewToken = async () => {
    const status = new spinner("Authenticating you, please wait...");
    status.start();

    try {
        const response = await Octokit.authorization.create({
            scopes: ["user", "public_repo", "repo", "repo:status"],
            note: 'ginits, the command-line tool for initializing Git repos',
        });

        const token = response.data.token;

        if (token) {
            conf.set("github.token", token);
            return token;
        } else {
            throw new Error("Missing Token", "Github token was not found in the response");
        }
    } catch (error) {
        throw error;
    } finally {
        status.stop();
    }
};


module.exports = {
    getInstance,
    getStoredGithubToken,
    setGithubCredentials,
    registerNewToken,
    githubAuth,
};