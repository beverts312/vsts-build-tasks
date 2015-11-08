FROM ubuntu:14.04

ENV vso_username user
ENV vso_password password
ENV vso_url http://user.visualstudio.com
ENV vso_agentpool default
ENV vso_agentname docker-agent

RUN apt-get update &&\
  apt-get install nodejs npm -y &&\
  apt-get install nodejs-legacy -y &&\
  npm install vsoagent-installer -g &&\
  mkdir opt/buildagent &&\
  mkdir opt/buildagent/_work &&\
  cd opt/buildagent &&\
  vsoagent-installer

RUN apt-get install curl -y &&\
  curl -sSL https://get.docker.com/ | sh &&\ 
  curl -L https://github.com/docker/machine/releases/download/v0.4.0/docker-machine_linux-amd64 > /usr/local/bin/docker-machine &&\
  chmod +x /usr/local/bin/docker-machine &&\ 
  curl -L https://github.com/docker/compose/releases/download/1.4.0/docker-compose-Linux-x86_64 > /usr/local/bin/docker-compose &&\
  chmod +x /usr/local/bin/docker-compose

ADD vsoagent.js /opt/buildagent/agent/vsoagent.js
ADD agent /opt/buildagent/.agent
ADD run.sh /opt/buildagent/run.sh

RUN chmod +x /opt/buildagent/run.sh

WORKDIR /opt/buildagent
CMD ./run.sh

