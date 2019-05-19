FROM node:12.2

ENV HOME=/home/app

ENV TZ=America/Sao_Paulo

ENV ELASTIC=${elasticsearch}

COPY package.json package-lock.json $HOME/node_docker/

WORKDIR $HOME/node_docker

RUN npm install --silent --progress=false

COPY . $HOME/node_docker

CMD ["npm", "start"]