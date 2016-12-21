import tl = require('vsts-task-lib/task');

const ansible = tl.tool(tl.which('ansible-playbook', true));

const cwd = tl.getPathInput('cwd', false);
const playbook = tl.getInput('playbook', true);
const extraVars = tl.getInput('extra', false);


tl.checkPath(cwd, 'cwd');
tl.cd(cwd);

ansible.arg(playbook);
if (extraVars) {
    ansible.arg('--extra-consts');
    ansible.arg('"' + extraVars + '"');
}

ansible.exec()
    .then((code) => {
        process.exit(code);
    })
    .fail((err) => {
        console.error(err.message);
        tl.debug('taskRunner fail');
        process.exit(1);
    });
