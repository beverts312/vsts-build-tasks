var path = require('path');
var tl = require('vso-task-lib');
var async = require('async');
var Docker = require('dockerode');

var echo = new tl.ToolRunner(tl.which('echo', true));

var machines = [];

var nodes = tl.getInput('nodes', true);
var access = tl.getInput('access', true);
var secret = tl.getInput('secret', true);
var vpcId = tl.getInput('vpc', true);
var securityGroup = tl.getInput('security',true);
var build = tl.getInput('build',true);
var name = build + '-aws-swarm-';

var docker = new Docker({socketPath: '/var/run/docker.sock'});
docker.createContainer({ Image: 'swarm', Cmd: ['create'], name: 'swarm' }, function (err, data, container) {
    if(err){
        console.log('Failed to get swarm ID');
        console.log(err.message);
    }
});
/*
function createMachine(num)
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
        dockerMachine.arg('--swarm-master');
    }
    dockerMachine.arg('--swarm-discovery');
    dockerMachine.arg('token://' + swarmId);
    dockerMachine.arg(name + num);
    return dockerMachine;
}

docker.exec({ failOnStdErr: false })
.then(function(data) {
    buffer.write(process.stdout);
    echo.arg(buffer.toString("utf-8"));
    echo.exec();
}).then(function(code) {
   for(var i=0 ; i < nodes; i++){
        machines.push(createMachine(i));
    }
    for(var i=0; i < nodes; i++){
        if(i != nodes-1){
            machines[i].exec({ failOnStdErr: false });
        } else {
            machines[i].exec({ failOnStdErr: false })
            .then(function(code){
                tl.exit(0);
            })
            .fail(function(err){
                console.error(err.message);
                tl.exit(1);
            })
        }
    }
    tl.exit(0);
}).fail(function(err) {
    console.error(err.message);
    tl.debug('taskRunner fail');
    tl.exit(1);
});*/