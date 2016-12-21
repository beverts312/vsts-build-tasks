import DockerAuth = require('./docker-auth');

class DockerEndpoint {
  name: string;
  type: string = 'dockerhost';
  url: string;
  authorization: DockerAuth = new DockerAuth();
}
export = DockerEndpoint;