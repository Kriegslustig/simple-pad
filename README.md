# simple-pad

A super simple notepad App with a minimalistic UI.

## Installation

First you'll need to install [Node LTS (4.4)](https://nodejs.org/en/download/package-manager/), [Docker](https://docs.docker.com/engine/installation/linux/ubuntulinux/) (choose the right distro first) and [docker-compose](https://docs.docker.com/compose/install/).

``` bash
# Start a mongodb container see https://hub.docker.com/_/mongo/ for persistant data storage.
cd /place/to/put/simple-pad
git clone https://github.com/Kriegslustig/simple-pad.git
cd simple-pad
# Extract the meteor app into a node app
npm i -g demeteorizer
demeteorizer
# Change the set port (4244 to something like 80)
vim docker-compose.yml
# Start the container in the backgroung
docker-compose up -d
```

## Update

```bash
cd /location/of/simple-pad
git pull
demeteorizer
# Restart and rebuild the container
docker-compose down
docker-compose build
docker-compose up
```

