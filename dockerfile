# backend/Dockerfile

FROM node:latest

WORKDIR /usr/src/app

RUN ls -la

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]
