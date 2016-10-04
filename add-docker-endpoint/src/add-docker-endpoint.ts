import tl = require("vsts-task-lib/task");
import path = require("path");
import fs = require("fs");
import request = require("request");

const name = tl.getInput("connectionName", true);
const serverUrl = tl.getInput("serverUrl", true);
const caCertPath = tl.getPathInput("caCertPath", true);
const certPath = tl.getPathInput("certPath", true);
const keyPath = tl.getPathInput("keyPath", true);

const systemAccessToken = tl.getVariable('System.AccessToken');
const collectionUri = tl.getVariable('System.TeamFoundationCollectionUri');
const project = tl.getVariable('System.TeamProject');
const uriPath = '_apis/distributedtask/serviceendpoints?api-version=3.0-preview.1'
const uri = collectionUri + project + uriPath;

tl.checkPath(caCertPath, 'cwd');
tl.checkPath(certPath, 'cwd');
tl.checkPath(keyPath, 'cwd');

if (!systemAccessToken) {
    tl.error('Unable to to access OAuth Token. ' +
        'Ensure the build definition is configured to Allow Scripts to Access the OAuth Token on the Options tab.');
}

request.get(uri, {'auth':{'bearer':systemAccessToken}}, (err:any, res: any, data: string) =>{
    console.log('data: ' + JSON.stringify(data));
    console.log('res: ' + JSON.stringify(res));
});