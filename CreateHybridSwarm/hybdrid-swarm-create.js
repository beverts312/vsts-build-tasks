var path = require('path');
var tl = require('vso-task-lib');
var async = require('async');
var echo = new tl.ToolRunner(tl.which('echo', true));
var docker = new tl.ToolRunner(tl.which('docker', true));
var machines = [];

var azureNodes = tl.getInput('azureNodes', true);
var awsNodes = tl.getInput('awsNodes', true);
var access = tl.getInput('access', true);
var secret = tl.getInput('secret', true);
var vpcId = tl.getInput('vpc', true);
var securityGroup = tl.getInput('security',true);
var swarmId = tl.getInput('swarm',true);
var subscriptionId = tl.getInput('azureId',true);
var certPath = tl.getInput('azureCert',true);
var build = tl.getInput('build',true);

function createAwsMachine(num)
{
    var dockerMachine = new tl.ToolRunner(tl.which('docker-machine', true));
    dockerMachine.arg('create');
    dockerMachine.arg('--driver');
    dockerMachine.arg('amazonec2');
    dockerMachine.arg('--amazonec2-access-key');
    dockerMachine.arg(access);
    dockerMachine.arg('--amazonec2-secret-key')
    dockerMachine.arg(secret);
    dockerMachine.arg('--amazonec2-vpc-id')
    dockerMachine.arg(vpcId);
    dockerMachine.arg('--amazonec2-security-group')
    dockerMachine.arg(securityGroup);
    dockerMachine.arg('--swarm');
    if(num==0){
        console.log('master');
        dockerMachine.arg('--swarm-master');
    }
    dockerMachine.arg('--swarm-discovery');
    dockerMachine.arg('token://' + swarmId);
    dockerMachine.arg(build + '-aws-node-'+ num);
    return dockerMachine;
}

function createAzureMachine(num)
{
    var dockerMachine = new tl.ToolRunner(tl.which('docker-machine', true));
    dockerMachine.arg('create');
    dockerMachine.arg('--driver');
    dockerMachine.arg('azure');
    dockerMachine.arg('--azure-subscription-id');
    dockerMachine.arg(subscriptionId);
    dockerMachine.arg('--azure-subscription-cert')
    dockerMachine.arg(certPath);
    dockerMachine.arg('--swarm');
    dockerMachine.arg('--swarm-discovery');
    dockerMachine.arg('token://' + swarmId);
    dockerMachine.arg(build + '-azure-node-'+ num);
    return dockerMachine;
}

var nodeCount = 0;
for(var i=0 ; i < awsNodes; i++){
    console.log('Create AWS task ' + i);
    nodeCount++;
    machines.push(createAwsMachine(i));
}
for(var i=0 ; i < azureNodes; i++){
    console.log('Create Azure task ' + i);  
    nodeCount++;      
    machines.push(createAzureMachine(i));
}
console.log(nodeCount);
for(var i=0; i < nodeCount; i++){
    console.log('Start task ' + i);        
    if(i != nodeCount-1){
        machines[i].exec({ failOnStdErr: false });
    } else {
        console.log('Final Task')
        machines[i].exec({ failOnStdErr: false })
        .then(function(code){
            console.log('Final Task Complete')
            tl.exit(0);
        })
        .fail(function(err){
            console.error(err.message);
            tl.exit(1);
        })
    }
}