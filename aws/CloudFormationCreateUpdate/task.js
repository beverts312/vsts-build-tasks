var path = require('path');
var tl = require('vso-task-lib');
var fs = require('fs');
var aws = require('aws-sdk');

var access = tl.getInput('access', true);
var secret = tl.getInput('secret', true);
var region = tl.getInput('region', true);      
var stackName = tl.getInput('stack', true);      
var templatePath = tl.getInput('template', true);      
var onFailure = tl.getInput('onFailure', true);      
var paramsPath = tl.getInput('paramsPath', false);      
var tags = tl.getInput('tags', false);      
aws.config.update({accessKeyId: access, secretAccessKey: secret});
aws.config.update({region: region});

var cloudformation = new aws.CloudFormation({apiVersion: '2010-05-15'});
var template = fs.readFileSync(templatePath, "utf8");
//var templateParams = fs.readFileSync(paramsPath, "utf8");
var params = {
  StackName: stackName,
  OnFailure: onFailure,
  TemplateBody: template,
  TimeoutInMinutes: 15,
  Parameters: require(paramsPath)
};
if(tags){
    params.Tags = tags;
}
else{
    console.log('No Tags passed');
}

cloudformation.createStack(params, function(err, data) {
  if (err){
    console.log(params);
    //console.log(err, err.stack);
    tl.exit(1);
  }    
  else {
    console.log(data);
    tl.exit(0);
  }
});