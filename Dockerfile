FROM safetyculture/node:8-builder-stretch AS builder8

ENV HOME /home/safetyculture-js

ARG NPM_TOKEN

WORKDIR $HOME

COPY [".babelrc", ".eslintrc", "package.json", "$HOME/"]

RUN echo "--- :npm: Node 8 - Install Dependencies" && npm install

COPY ["dist", "dist"]
COPY ["lib", "lib"]
COPY ["webpack.config.js", "webpack.config.js"]
COPY ["examples", "examples"]
COPY ["test", "test"]
COPY ["src", "src"]

RUN echo "--- :memo: Node 8 - Running Tests" && npm test
