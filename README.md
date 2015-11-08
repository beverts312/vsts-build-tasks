## vsoagent Docker Image 
***Still working on this***  
This is for a containerized VSO build agent.
Included binaries
- docker
- docker-compose
- docker-machine  
http://roadtoalm.com/2015/08/07/running-a-visual-studio-build-vnext-agent-in-a-docker-container/  
  
## Working with Tasks
For doing anything with tasks you will need:   
- tfx-cli (`npm install -g tfx-cli`)
- a personal access token (go to the 'Security' tab on your VSO profile)  

You will then need to connect to your VSO account by running `tfx login`  

You can then run:  
- `tfx build tasks list` lists all your tasks and some basic info about them  
- `tfx build tasks create` will ask you some questions about the task you want to make and create a template for it  
- `tfx build tasks upload <task dir>` uploads the task your VSO account (you will need to use `--overwrite=true` if the task already exists)

# Tasks  

## Docker Build  
This task must be run using the xplat agent with docker installed.  
Lets you build a Dockerfile into a Docker Image
Parameters:  
- Working Directory: this should be where your dockerfile is located  
- Image Name: name to tag your image with (i.e beverts312/vsoagent)

## Docker Tag  
This task must be run using the xplat agent with docker installed.  
Lets you tag a docker image
Parameters:  
- Old Tag: Old Image tag (i.e beverts312/vsoagent)
- New Tag: New Image tag (i.e beverts312/vsoagent:100)

## Docker Push  
This task must be run using the xplat agent with docker installed.  
Lets you push a docker image
Parameters:  
- Image Name: name of the image to push (i.e beverts312/vsoagent)

## Create Azure Swarm Cluster  
***Coming Soon***


## Create AWS Swarm Cluster  
***Coming Soon***


## Create Hybrid Swarm Cluster  
***Coming Soon***
