FROM node:18-alpine

RUN yarn global add @angular/cli
RUN apk add --no-cache curl

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
EXPOSE 4000
