FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

RUN mkdir -p /app/uploads /app/data

EXPOSE 4000
CMD ["npm", "start"]
