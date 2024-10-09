FROM node:18 as build
WORKDIR /app

COPY ./SciCite-main/package.json .
COPY ./SciCite-main/yarn.lock .

RUN npm install

COPY ./SciCite-main/ .
RUN npm run build

FROM nginx:1.25-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY ./deploy/nginx/nginx.conf /etc/nginx/conf.d
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]