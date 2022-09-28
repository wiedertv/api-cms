FROM node:12-alpine

WORKDIR /srv/app

COPY . .

RUN npm i
RUN npm run build

COPY . .

CMD [ "npm", "run", "start:dev" ]
