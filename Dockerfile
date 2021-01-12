FROM nginx:alpine

EXPOSE 8888

# adding yarn + installing a bunch of stuff as a workaround for alpine bug suggested here https://gitlab.alpinelinux.org/alpine/aports/-/issues/11615
RUN apk add -U --no-cache nghttp2-dev nodejs npm unzip yarn

WORKDIR /frinx-frontend
COPY . .

RUN yarn install --frozen-lockfile && yarn cache clean

# TODO there should be a build for whole repo, not an individual project
RUN cd packages/frinx-dashboard && cp .env.example .env && yarn build

RUN rm -rf /usr/share/nginx/html
RUN cp nginx.conf /etc/nginx/nginx.conf

# TODO we should have static code generated for the whole repo, not an individual project
RUN cp -avr packages/frinx-dashboard/dist /usr/share/nginx/html
