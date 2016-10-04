import tl = require("vsts-task-lib/task");
import path = require("path");
import fs = require("fs");
import request = require("request");

const name = tl.getInput("connectionName", true);
const serverUrl = tl.getInput("serverUrl", true);
const caCertPath = tl.getPathInput("caCertPath", true);
const certPath = tl.getPathInput("certPath", true);
const keyPath = tl.getPathInput("keyPath", true);
const systemAccessToken = tl.getVariable('System.AccessToken');

tl.checkPath(caCertPath, "cwd");
tl.checkPath(certPath, "cwd");
tl.checkPath(keyPath, "cwd");

if (!systemAccessToken) {
    tl.error('Unable to to access OAuth Token. ' +
        'Ensure the build definition is configured to Allow Scripts to Access the OAuth Token on the Options tab.');
}
