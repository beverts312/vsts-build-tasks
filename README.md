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
| [add-docker-endpoint](./tasks/add-docker-endpoint/README.md)| Adds a docker service endpoint| 
| [run-ansible-playbook](./tasks/run-ansible-playbook/README.md) | Run Ansible Playbook |  
| [run-sonar-scanner](./tasks/run-sonar-scanner/README.md) | Run Sonar Scanner |  
| [s3-upload](./tasks/s3-upload/README.md) | Upload File(s) to AWS S3 |  
