FROM node:12
MAINTAINER Nathan Smith <nathanrandal@gmail.com>

WORKDIR /opt/graphq-query-utils
ADD package.json package-lock.json ./
RUN npm install
VOLUME /opt/graphq-query-utils/node_modules

ADD test test
ADD lib lib
CMD bash
