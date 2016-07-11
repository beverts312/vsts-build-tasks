## Working with Tasks
For doing anything with tasks you will need:   
- tfx-cli (`npm install -g tfx-cli`)
- a personal access token (go to the 'Security' tab on your VSO profile)  

You will then need to connect to your VSTS account by running `tfx login`  

You can then run:  
- `tfx build tasks list` lists all your tasks and some basic info about them  
- `tfx build tasks create` will ask you some questions about the task you want to make and create a template for it  
- `tfx build tasks upload` uploads the task your VSTS account  

# Tasks  

| Task | Description |
|----------|-------------|
| [docker-build](./docker-build/README.md) | Builds a Docker Image |  
| [docker-login](./docker-login/README.md) | Login to Docker Hub |  
| [docker-push](./docker-push/README.md) | Push Docker Image |  
| [run-ansible-playbook](./run-ansible-playbook/README.md) | Run Ansible Playbook |  
| [run-sonar-scanner](./run-sonar-scanner/README.md) | Run Sonar Scanner |  
| [s3-upload](./s3-upload/README.md) | Upload File(s) to AWS S3 |  

# Dockerized VSTS Agent  
Want to run your VSTS agent as a docker container? You can do this easily by using [beverts312/vsts-agent](https://hub.docker.com/r/beverts312/vsts-agent/) or you can use my [images](https://github.com/beverts312/vsts-build-tasks) as reference.