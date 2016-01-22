var tl = require('vso-task-lib');
var aws = require('aws-sdk');
var fs = require('fs');

var getFilesInDirectory = require('./get-files.js');
var getContentType = require('./get-content-type.js');

var access = tl.getInput('access', true);
var secret = tl.getInput('secret', true);
var dir = tl.getPathInput('dir', true);
var bucket = tl.getInput('bucket', true);      
var region = tl.getInput('region', true);      
var acl = tl.getInput('acl', false);      

aws.config.update({accessKeyId: access, secretAccessKey: secret});
aws.config.update({region: region});

var s3 = new aws.S3();

fs.lstat(dir, function(err, stats) {
    if (err) {
        tl.error(err);
    }
    if (stats.isDirectory()) {
        getFilesInDirectory(dir, function(err, files){
            files.forEach(function(file){
                var shortFile = file.substring(dir.length + 1);        
                var params = {Bucket: bucket, Key: shortFile, ACL: acl, ContentType: getContentType(file.split('.').pop()), Body: fs.createReadStream(file) };
                s3.upload(params, function(err, data) {
                    if(err){
                        tl.error('Error uploading ' + file);
                        tl.error(err);    
                    }
                    else{
                        console.log('Uploaded ' + shortFile);
                    }
                });
            });
        });
    }
    else{              
        var params = {Bucket: bucket, Key: dir, ACL: acl, ContentType: getContentType(dir.split('.').pop()), Body: fs.createReadStream(dir) };
        s3.upload(params, function(err, data) {
            if(err){
                tl.error(err);    
            }
            else{
                console.log('Uploaded ' + dir);
            }
        });
    }
});