FROM alpine:3.20 AS builder

WORKDIR /app

COPY html/ .

FROM nginx:1.27-alpine

ARG NGINX_VERSION
LABEL version=$NGINX_VERSION

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80