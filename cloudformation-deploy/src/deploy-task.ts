import tl = require('vsts-task-lib/task');
import CloudFormationUtils = require('./cloud-formation-utils');

const name = tl.getInput('stackName', true);
let templatePath = tl.getPathInput('templatePath', false);
const templateUrl = tl.getInput('templateUrl', false);
//const paramsPath = tl.getPathInput('paramsPath', false);
const access = tl.getInput('awsAccess', true);
const secret = tl.getInput('awsSecret', true);
const region = tl.getInput('awsRegion', true);

const opts = {
    accessKeyId: access,
    secretAccessKey: secret,
    region: region
};

const cloudform = new CloudFormationUtils(opts);

const success = () => {
    console.log('%s created/updated successfully', name);
    tl.exit(0);
};

const fail = (err) => {
    tl.error('One or more errors occured');
    tl.error(err);
    tl.exit(1);
}

if(templatePath == process.env.BUILD_SOURCESDIRECTORY){
    templatePath = null;
}

if((!templateUrl && !templatePath) || (templateUrl && templatePath)) {
    tl.error('Must provide either template Url or Path');
    tl.exit(1);
}
else if (templatePath) {
    cloudform.createOrUpdateStackFile(name, templatePath).then(success)
        .catch(fail);
}
else {
    cloudform.createOrUpdateStackUrl(name, templateUrl).then(success)
        .catch(fail);
}
