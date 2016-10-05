import tl = require('vsts-task-lib/task');
import path = require('path');
import fs = require('fs');
import request = require('request');

import DockerEndpoint = require('./models/docker-endpoint');
import DockerAuth = require('./models/docker-auth');
import DockerAutParams = require('./models/docker-auth-params');

const name = tl.getInput('connectionName', true);
const user = tl.getInput('user', true);
const pat = tl.getInput('pat', true);
const project = tl.getInput('project', true);
const serverUrl = tl.getInput('serverUrl', true);
const caCertPath = tl.getPathInput('caCertPath', true);
const certPath = tl.getPathInput('certPath', true);
const keyPath = tl.getPathInput('keyPath', true);

const collectionUri = tl.getVariable('System.TeamFoundationCollectionUri');
const apiVersion = '?api-version=3.0-preview.1';
const endpointPath = '/_apis/distributedtask/serviceendpoint';
const authStr = 'https://' + user + ':' + pat + '@';
const uriBase = collectionUri.replace('https://', authStr) + project + endpointPath;
let uri = uriBase + 's' + apiVersion;


tl.checkPath(caCertPath, 'cwd');
tl.checkPath(certPath, 'cwd');
tl.checkPath(keyPath, 'cwd');

let dockerEndpoint = new DockerEndpoint();
dockerEndpoint.name = name;
dockerEndpoint.url = serverUrl;
dockerEndpoint.authorization.parameters.cacert = fs.readFileSync(caCertPath, 'utf8');
dockerEndpoint.authorization.parameters.cert = fs.readFileSync(certPath, 'utf8');
dockerEndpoint.authorization.parameters.certificate = dockerEndpoint.authorization.parameters.cert;
dockerEndpoint.authorization.parameters.key = fs.readFileSync(keyPath, 'utf8');

request.get(uri, (err: any, res: any, data: string) => {
    if (!err) {
        console.log('Succesfully retrieved existing endpoints');
        let update = false;
        let endpoints =  (JSON.parse(data)).value;
        for( var i = 0; i < endpoints.length; i++){
            if(endpoints[i].name == name){
                update = true;
                uri = uriBase + '/' + endpoints[i].id + apiVersion;
            }
        }
        if (update == true){
            console.log('Endpoint with name %s exists, updating existing endpoint', name);
            request.put(uri, { json: true, body: dockerEndpoint }, (err: any, res: any, data: string) => {
                if (err) {
                    tl.error(err);
                }
                else {
                    console.log('Updated Succesfully');
                }
            });
        }
        else {
            console.log('Endpoint does not exist, creating new endpoint');
            request.post(uri, { json: true, body: dockerEndpoint }, (err: any, res: any, data: string) => {
                if (err) {
                    tl.error(err);
                }
                else {
                    console.log('Created Succesfully');                    
                }
            });
        }
    }
    else {
        console.log('Failed to retrieve existing endpoints');
        tl.error(err);
    }
});


/* Use this instead of PAT once oauth issue is fixed on MSFT side
const systemAccessToken = tl.getVariable('System.AccessToken');
if (!systemAccessToken) {
    tl.error('Unable to to access OAuth Token. ' +
        'Ensure the build definition is configured to Allow Scripts to Access the OAuth Token on the Options tab.');
}
request.post(uri, {'auth':{'bearer':systemAccessToken}, json: true, body: dockerEndpoint }, (err:any, res: any, data: string) =>{
    console.log('data: ' + JSON.stringify(data));
    console.log('res: ' + JSON.stringify(res));
});*/