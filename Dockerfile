FROM node:16.16.0-alpine as build

ARG PRIVATE_GH_TOKEN
ARG PRIVATE_NPM_TOKEN
ENV PRIVATE_GH_TOKEN=$PRIVATE_GH_TOKEN
ENV PRIVATE_NPM_TOKEN=$PRIVATE_NPM_TOKEN

RUN mkdir /build
COPY . /build/

WORKDIR /build
RUN cp .yarnrc.ci.yml .yarnrc.yml
RUN yarn install --immutable
ENV NODE_ENV production
RUN yarn run build

FROM node:16.16.0-alpine

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 8888

EXPOSE 8888

ARG COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

COPY --from=build /build/yarn.lock /build/yarn.lock
COPY --from=build /build/packages/frinx-frontend-server/package.json /build/package.json

WORKDIR /build
RUN yarn install --prod --immutable

COPY --from=build /build/build-client /build/build-client
COPY --from=build /build/build-server /build/build-server

CMD ["yarn", "start"]
