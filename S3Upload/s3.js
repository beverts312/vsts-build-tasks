var tl = require('vso-task-lib');
var aws = require('aws-sdk');
var fs = require('fs');

var access = tl.getInput('access', true);
var secret = tl.getInput('secret', true);
var file = tl.getPathInput('file', true);
var bucket = tl.getInput('bucket', true);      
var region = tl.getInput('region', true);      
var prefix = tl.getInput('prefix', false);      

aws.config.update({accessKeyId: access, secretAccessKey: secret});
aws.config.update({region: region});

var s3 = new aws.S3();
var params = {Bucket: bucket, Key: 'key', Body: fs.createReadStream(file) };
s3.upload(params, function(err, data) {
  if(err){
    tl.error(err);
    tl.debug('taskRunner fail');
    tl.exit(1);    
  }
  else{
    tl.debug(data);
    tl.debug('success');
    tl.exit(0);
  }
});



