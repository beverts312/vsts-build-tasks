var path = require('path');
var fs = require('fs');
var tl = require('vso-task-lib');

var credsfile = tl.getPathInput('cwd', true) + "/credentials.yml";
var access = "aws_access_key: " + tl.getInput('access', true);
var secret = "aws_secret_key: " + tl.getInput('secret', true);
var keypair = "aws_keypair: " + tl.getInput('keypair', true);
var owner = "aws_owner: " + tl.getInput('owner', true);

var contents = [ '---', '', access, secret, keypair, owner ];

var file = fs.createWriteStream(credsfile);
file.on('error', function(err) { 
    tl.err(err);
    tl.exit(1);
 });
contents.forEach(function(v) { 
    file.write(v + '\n'); 
});
file.end();