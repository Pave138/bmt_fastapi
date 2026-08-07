FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["sh", "-c", "cp -r /app/dist/. /app/build/ && tail -f /dev/null"]