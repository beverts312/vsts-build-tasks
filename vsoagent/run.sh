#!/bin/bash 
echo $vso_username > inputs.txt
echo $vso_password >> inputs.txt 
sed -i 's@NAME@'$vso_agentname'@' .agent
sed -i 's@SERVER@'$vso_url'@' .agent
sed -i 's@POOL@'$vso_agentpool'@' .agent
cat inputs.txt | node agent/vsoagent

