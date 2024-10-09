FROM node:lts-alpine as build89.169.39.137

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest as prod

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
