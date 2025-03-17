FROM node:18-alpine
RUN npm install -g @angular/cli

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
EXPOSE 4000
