var path = require('path');
var tl = require('vso-task-lib');

var docker = new tl.ToolRunner(tl.which('docker', true));

var name = tl.getInput('name', true);
var cwd = tl.getPathInput('cwd', false);

tl.checkPath(cwd, 'cwd');
tl.cd(cwd);

var failOnStdErr = tl.getInput('failOnStandardError') == 'true';

docker.arg('push');
docker.arg(name);

docker.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})