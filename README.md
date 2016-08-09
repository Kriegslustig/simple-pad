# simple-pad

A super simple notepad App with a minimalistic UI.

## Installation

``` bash
# Start a mongodb container see https://hub.docker.com/_/mongo/ for persistant data storage.
cd /place/to/put/simple-pad
git clone https://github.com/Kriegslustig/simple-pad.git
cd simple-pad
npm i
# Build the docker-image. This might take a while.
docker build . --tag=simple_pad
# Start up a database.
docker run -d --name mongo_simple_pad --restart always mongo:latest
# Run the docker image. Replace [localport] with the port simple_pad should run on.
docker run -dp [localport]:80 --restart always --name simple_pad --link mongo_simple_pad:mongo simple_pad
```

## Update

```bash
cd /location/of/simple-pad
git pull
docker build . --tag=simple_pad
docker stop simple_pad
docker rm simple_pad
docker run -dp [localport]:80 --restart always --name simple_pad --link mongo_simple_pad:mongo simple_pad
```

