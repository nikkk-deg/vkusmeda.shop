FROM node:alpine

RUN npm install -g @angular/cli

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN ng build

EXPOSE 4000

CMD ["node","dist/client2/server/server.mjs"]

