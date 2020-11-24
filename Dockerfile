FROM alpine:3.9 AS builder

# watchman build dependencies
RUN apk add --no-cache libcrypto1.1 libgcc libstdc++
RUN apk add --no-cache --update ca-certificates openssl

# watchman build-tools dependencies:
RUN apk add --no-cache \
 automake \
 autoconf \
 bash \
 build-base \
 libtool \
 linux-headers \
 openssl-dev \
 python-dev

# version 4.9.0 compiles on alpine correctly
ENV WATCHMAN_VERSION=4.9.0 \
    WATCHMAN_SHA256=1f6402dc70b1d056fffc3748f2fdcecff730d8843bb6936de395b3443ce05322

# download watchman source code
RUN cd /tmp \
 && wget -O watchman.tar.gz "https://github.com/facebook/watchman/archive/v${WATCHMAN_VERSION}.tar.gz" \
 && echo "$WATCHMAN_SHA256 *watchman.tar.gz" | sha256sum -c - \
 && tar -xz -f watchman.tar.gz -C /tmp/ \
 && rm -rf watchman.tar.gz

# build watchman
RUN cd /tmp/watchman-${WATCHMAN_VERSION} \
 && ./autogen.sh \
 && ./configure --enable-lenient \
 && make \
 && make install \
 && cd $HOME \
 && rm -rf /tmp/*

FROM nginx:alpine

EXPOSE 5000

COPY --from=builder /usr/local/bin/watchman* /usr/local/bin/
COPY --from=builder /usr/local/share/doc/watchman-4.9.0 /usr/local/share/doc/watchman-4.9.0
COPY --from=builder /usr/local/var/run/watchman /usr/local/var/run/watchman

COPY . /resource-manager-frontend

WORKDIR /resource-manager-frontend

RUN apk add --no-cache yarn

RUN yarn install --frozen-lockfile && yarn cache clean
RUN yarn relay
RUN yarn build

RUN rm -rf /usr/share/nginx/html
RUN cp nginx.conf /etc/nginx/nginx.conf
RUN cp -avr dist /usr/share/nginx/html
