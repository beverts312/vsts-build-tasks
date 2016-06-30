var path = require('path');
var tl = require('vso-task-lib');

var ansible = new tl.ToolRunner(tl.which('ansible-playbook', true));

var cwd = tl.getPathInput('cwd', false);
var playbook = tl.getInput('playbook', true);
var extraVars = tl.getInput('extra', false);


tl.checkPath(cwd, 'cwd');
tl.cd(cwd);

var failOnStdErr = tl.getInput('failOnStandardError') == 'true';

ansible.arg(playbook);
if(extraVars){
    ansible.arg('--extra-vars');
    ansible.arg('"' + extraVars + '"');
}

ansible.exec({ failOnStdErr: false})
.then(function(code) {
    tl.exit(code);
})
.fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
})
