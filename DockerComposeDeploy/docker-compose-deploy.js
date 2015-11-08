var path = require('path');
var tl = require('vso-task-lib');

var echo = new tl.ToolRunner(tl.which('echo', true));
var compose = new tl.ToolRunner(tl.which('docker-compose', true));

var cwd = tl.getPathInput('cwd', false);
var file = tl.getPathInput('file', false);
var scale = tl.getPathInput('scale', false);
var name = tl.getPathInput('name', false);
var swarm = tl.getPathInput('swarm', false);
var host = tl.getPathInput('host', false);

if(file != 'docker-compose.yml'){
    compose.arg('-f');
    compose.arg(file);
}
if(scale){
    compose.arg('scale');
    compose.arg(scale);
}


tl.cd(cwd);

echo.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})
