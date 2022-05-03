ARG COMMIT_HASH

FROM node:16.14.2-alpine as build

RUN mkdir /build
COPY . /build/

WORKDIR /build
RUN yarn install --immutable
ENV NODE_ENV production
ENV COMMIT_HASH=$COMMIT_HASH
RUN yarn run build

FROM node:16.14.2-alpine

ENV NODE_ENV production

ENV HOST 0.0.0.0
ENV PORT 8888

EXPOSE 8888

COPY --from=build /build/yarn.lock /build/yarn.lock
COPY --from=build /build/packages/frinx-frontend-server/package.json /build/package.json

WORKDIR /build
RUN yarn install --prod --immutable

COPY --from=build /build/build-client /build/build-client
COPY --from=build /build/build-server /build/build-server

CMD ["yarn", "start"]