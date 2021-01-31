#!/bin/bash


docker build -t cat-scratch -f Dockerfile.localdev .

echo "Booting container"

PROJECT_ROOT=$PWD

docker run -p 8080 -v $PROJECT_ROOT:/home/node/project -u node --network host --entrypoint /bin/bash --name cat-scratch-code-server -t -d cat-scratch code-server
sleep 2
docker exec -u node cat-scratch bash -c "cat ~/.config/code-server/config.yaml"
