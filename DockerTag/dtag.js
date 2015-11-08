var path = require('path');
var tl = require('vso-task-lib');

var docker = new tl.ToolRunner(tl.which('docker', true));

var oldTag = tl.getInput('oldTag', true);
var newTag = tl.getInput('newTag', true);

var failOnStdErr = tl.getInput('failOnStandardError') == 'true';

docker.arg('tag');
docker.arg(oldTag);
docker.arg(newTag);

docker.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})
