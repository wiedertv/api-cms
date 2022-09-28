FROM node:alpine

WORKDIR /srv/app

COPY . .
RUN npm i --silent
COPY . .

CMD [ "npm", "run", "start" ]
