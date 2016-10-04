import tl = require("vsts-task-lib/task");
import path = require("path");
import fs = require("fs");
import request = require("request");

import DockerEndpoint = require('./models/docker-endpoint');
import DockerAuth = require('./models/docker-auth');
import DockerAutParams = require('./models/docker-auth-params');

const name = tl.getInput("connectionName", true);
const serverUrl = tl.getInput("serverUrl", true);
const caCertPath = tl.getPathInput("caCertPath", true);
const certPath = tl.getPathInput("certPath", true);
const keyPath = tl.getPathInput("keyPath", true);

const systemAccessToken = tl.getVariable('System.AccessToken');
const collectionUri = tl.getVariable('System.TeamFoundationCollectionUri');
const project = tl.getVariable('System.TeamProject');
const uriPath = '/_apis/distributedtask/serviceendpoints?api-version=3.0-preview.1'
const uri = collectionUri + project + uriPath;

tl.checkPath(caCertPath, 'cwd');
tl.checkPath(certPath, 'cwd');
tl.checkPath(keyPath, 'cwd');

if (!systemAccessToken) {
    tl.error('Unable to to access OAuth Token. ' +
        'Ensure the build definition is configured to Allow Scripts to Access the OAuth Token on the Options tab.');
}

let dockerEndpoint = new DockerEndpoint();
dockerEndpoint.name = name;
dockerEndpoint.url = serverUrl;
dockerEndpoint.authorization.parameters.cacert = fs.readFileSync(caCertPath, 'utf8');
dockerEndpoint.authorization.parameters.cert = fs.readFileSync(certPath, 'utf8');
dockerEndpoint.authorization.parameters.certificate = dockerEndpoint.authorization.parameters.cert;
dockerEndpoint.authorization.parameters.key = fs.readFileSync(keyPath, 'utf8');

request.post(uri, {'auth':{'bearer':systemAccessToken}, json: true, body: dockerEndpoint }, (err:any, res: any, data: string) =>{
    console.log('data: ' + JSON.stringify(data));
    console.log('res: ' + JSON.stringify(res));
});