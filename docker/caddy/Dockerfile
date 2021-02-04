# syntax = docker/dockerfile:1.2
FROM caddy:2.2.1-builder-alpine
ARG CADDY_BUILD_ARGS

RUN --mount=type=cache,target=/go xcaddy build ${CADDY_BUILD_ARGS}

FROM alpine:latest
COPY --from=0 /usr/bin/caddy /usr/bin/caddy

RUN set -eux; \
	mkdir -p \
		/config/caddy \
		/data/caddy \
		/etc/caddy \
		/usr/share/caddy

ENV XDG_CONFIG_HOME /config
ENV XDG_DATA_HOME /data

VOLUME /config
VOLUME /data

WORKDIR /srv

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
