var path = require('path');
var tl = require('vso-task-lib');

var docker = new tl.ToolRunner(tl.which('docker', true));

var name = tl.getInput('name', true);
var password = tl.getInput('password', true);
var email = tl.getInput('email', true);

var failOnStdErr = tl.getInput('failOnStandardError') == 'true';

docker.arg('login');
docker.arg('-u');
docker.arg(name);
docker.arg('-p');
docker.arg(password);
docker.arg('-e');
docker.arg(email);

docker.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})
