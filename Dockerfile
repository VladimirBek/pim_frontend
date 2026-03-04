### front image
FROM node:alpine AS frontend

RUN set -eux; \
    npm install -g npm; \
    #clean up
    npm cache clean -f

COPY . /app

WORKDIR /app

RUN npm config set proxy null && npm config set https-proxy null && npm config set registry https://registry.npmjs.org/

RUN set -eux; \
    npm install; \
    npm run build
### end ###

### nginx images ###
FROM nginx:alpine AS nginx

COPY docker/nginx.conf /etc/nginx
COPY --from=frontend /app/dist /app/dist


