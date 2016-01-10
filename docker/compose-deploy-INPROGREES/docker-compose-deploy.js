var path = require('path');
var tl = require('vso-task-lib');

var compose = new tl.ToolRunner(tl.which('docker-compose', true));

var cwd = tl.getPathInput('cwd', false);
var scale = tl.getPathInput('scale', false);

if(scale){
    compose.arg('scale');
    compose.arg(scale);
}
compose.arg('up');
compose.arg('-d');

tl.cd(cwd);

compose.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})
