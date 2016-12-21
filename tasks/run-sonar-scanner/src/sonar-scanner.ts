import tl = require("vsts-task-lib/task");
import path = require("path");
import fs = require("fs");

let sonar = tl.createToolRunner(tl.which("sonar-scanner", false));

let cwd = tl.getPathInput("cwd", false);
let sonarSources = tl.getInput("projectFolders", false);
let projectKey = tl.getInput("projectKey", true);
let projectName = tl.getInput("projectName", true);
let projectLanguage = tl.getInput("language", true);
let projectVersion = tl.getInput("projectVersion", false);
let sonarUrl = tl.getInput("sonarUrl", false);
let sonarUser = tl.getInput("sonarUser", false);
let sonarPassword = tl.getInput("sonarPassword", false);
let propertyFileName = cwd + "/sonar-project.properties";

tl.checkPath(cwd, "cwd");
tl.cd(cwd);

sonar.arg("-e");
sonar.arg("-Dsonar.host.url=" + sonarUrl);
sonar.arg("-Dsonar.login=" + sonarUser);
sonar.arg("-Dsonar.password=" + sonarPassword);
sonar.arg("-Dsonar.projectKey=" + projectKey);
sonar.arg("-Dsonar.projectName=" + projectName);
sonar.arg("-Dsonar.projectVersion=" + projectVersion);
sonar.arg("-Dsonar.language=" + projectLanguage);
sonar.arg("-Dsonar.sources=" + sonarSources);

sonar.exec({ failOnStdErr: false })
    .then((code) => {
        tl.exit(code);
    })
    .fail((err) => {
        console.error(err.message);
        tl.debug("taskRunner fail");
        tl.exit(1);
    });
