FROM node:10.15-alpine as build

WORKDIR /app
COPY . .
RUN npm i

# RUN npm rebuild node-sass

RUN npm run build

FROM nginx:1.14-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/* /usr/share/nginx/html/