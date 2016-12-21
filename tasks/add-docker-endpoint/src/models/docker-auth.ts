import DockerAuthParams = require('./docker-auth-params');

class DockerAuth {
    scheme: string = 'Certificate';
    parameters: DockerAuthParams = new DockerAuthParams();
}
export = DockerAuth;