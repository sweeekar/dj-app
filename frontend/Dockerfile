FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BASE_PATH=/dj-app/
ENV VITE_BASE_PATH=$VITE_BASE_PATH
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG VITE_BASE_PATH=/dj-app/
RUN mkdir -p /usr/share/nginx/html/dj-app
COPY --from=build /app/dist /usr/share/nginx/html/dj-app
EXPOSE 80
