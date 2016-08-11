############################################################
# https://github.com/Kriegslustig/Docker-Meteorbase
#
# Based on ubuntu:latest
############################################################

FROM ubuntu:latest
MAINTAINER Kriegslustig

RUN apt-get upgrade && \
  apt-get update && \
  apt-get install -qqy curl build-essential && \
  curl -sL https://deb.nodesource.com/setup_4.x | bash -e

RUN apt-get install -yqq nodejs

ADD ./.demeteorized/bundle /var/app
WORKDIR /var/app/programs/server

ENV ROOT_URL='http://pad.halunka.me'
ENV PORT=80

RUN npm i -g n
RUN n 0.10.40
RUN npm i

EXPOSE 80

CMD export MONGO_URL="mongodb://mongo:27017" && npm start

