FROM node:18-alpine AS builder
RUN npm install -g @angular/cli
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN ng build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/client2/server/server.mjs"]
EXPOSE 4000
