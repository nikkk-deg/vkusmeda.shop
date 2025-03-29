FROM node:18-slim
RUN npm install -g @angular/cli
RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
EXPOSE 4000
