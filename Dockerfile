FROM denoland/deno:alpine-2.5.2

RUN apk add --no-cache nginx bash openssl curl

RUN mkdir -p /app /var/www/html /var/log/nginx /var/lib/nginx /run/nginx /scripts /app/deployments

COPY deno.json /app/deno.json

RUN cd /app && \
    deno cache --no-lock https://deno.land/x/oak@v12.6.1/mod.ts && \
    deno cache --no-lock https://deno.land/std@0.202.0/fs/mod.ts && \
    deno cache --no-lock https://deno.land/std@0.202.0/path/mod.ts && \
    deno cache --no-lock https://deno.land/x/bcrypt@v0.4.1/mod.ts && \
    deno cache --no-lock https://deno.land/x/djwt@v2.9/mod.ts && \
    echo "Dependencies cached successfully"

COPY . /app
WORKDIR /app

COPY scripts/ /scripts/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /scripts/*.sh

RUN deno cache --no-lock main.ts cli/main.ts && \
    echo "Application cached successfully"

EXPOSE 80

CMD ["/bin/bash", "/scripts/init.sh"]