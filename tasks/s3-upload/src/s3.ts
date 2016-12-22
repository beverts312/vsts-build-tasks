import tl = require('vsts-task-lib/task');
import utils = require('aws-mgmt-utils');

const dir = tl.getPathInput('dir', true);
const bucket = tl.getInput('bucket', true);
const acl = tl.getInput('acl', false);
const prefix = tl.getInput('prefix', false);


const s3 = new utils.S3();

s3.uploadToS3(dir, bucket, acl, prefix).then(() => {
    tl.debug('Success');
}).catch((err) => {
    tl.error(err.message);
    process.exit(1);
});