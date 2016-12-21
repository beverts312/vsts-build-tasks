import tl = require('vsts-task-lib/task');
const sonar = tl.tool(tl.which('sonar-scanner', false));

const cwd = tl.getPathInput('cwd', false);
const sonarSources = tl.getInput('projectFolders', false);
const projectKey = tl.getInput('projectKey', true);
const projectName = tl.getInput('projectName', true);
const projectLanguage = tl.getInput('language', true);
const projectVersion = tl.getInput('projectVersion', false);
const sonarUrl = tl.getInput('sonarUrl', false);
const sonarUser = tl.getInput('sonarUser', false);
const sonarPassword = tl.getInput('sonarPassword', false);
//const propertyFileName = cwd + '/sonar-project.properties';

tl.checkPath(cwd, 'cwd');
tl.cd(cwd);

sonar.arg('-e');
sonar.arg('-Dsonar.host.url=' + sonarUrl);
sonar.arg('-Dsonar.login=' + sonarUser);
sonar.arg('-Dsonar.password=' + sonarPassword);
sonar.arg('-Dsonar.projectKey=' + projectKey);
sonar.arg('-Dsonar.projectName=' + projectName);
sonar.arg('-Dsonar.projectVersion=' + projectVersion);
sonar.arg('-Dsonar.language=' + projectLanguage);
sonar.arg('-Dsonar.sources=' + sonarSources);

sonar.exec()
    .then((code) => {
        process.exit(code);
    })
    .fail((err) => {
        console.error(err.message);
        tl.debug('taskRunner fail');
        process.exit(1);
    });
