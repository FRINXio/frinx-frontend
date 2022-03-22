FROM node:14.19.1-alpine as build

RUN mkdir /build
COPY . /build/

WORKDIR /build
RUN yarn install --immutable
ENV NODE_ENV production
RUN yarn run build

FROM node:14.19.1-alpine

ENV NODE_ENV production

ENV HOST 0.0.0.0
ENV PORT 8888

EXPOSE 8888

COPY --from=build /build/yarn.lock /build/yarn.lock
COPY --from=build /build/packages/frinx-frontend-server/package.json /build/package.json

WORKDIR /build
RUN yarn install --prod --frozen-lockfile

COPY --from=build /build/build-client /build/build-client
COPY --from=build /build/build-server /build/build-server

CMD ["yarn", "start"]
