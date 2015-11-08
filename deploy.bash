#!/bin/bash

project_name=simple_pad

cd /var/app/simple-pad
git pull

demeteorizer
if (( ${?} > 0 )); then exit 1; fi

docker build -t ${project_name} .
if (( ${?} > 0 )); then exit 1; fi

docker stop ${project_name}
docker rm ${project_name}
docker run -dp 4244:80 --link mongo_${project_name}:mongo --name ${project_name} --restart=always ${project_name}

