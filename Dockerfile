FROM node:18.18.0-alpine as build

ARG PRIVATE_NPM_TOKEN
ENV PRIVATE_NPM_TOKEN=$PRIVATE_NPM_TOKEN

RUN mkdir /build
COPY . /build/

WORKDIR /build
RUN cp .npmrc.ci .npmrc
RUN npm ci
ENV NODE_ENV production
RUN npm run build

FROM node:18.18.0-alpine
LABEL org.opencontainers.image.source="https://github.com/FRINXio/frinx-frontend"

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 8888

EXPOSE 8888

ARG COMMIT_HASH=unspecified
LABEL git_commit=$COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

COPY --from=build /build/package-lock.json /build/package-lock.json
COPY --from=build /build/packages/frinx-frontend-server/package.json /build/package.json

WORKDIR /build
RUN npm ci --prod

COPY --from=build /build/build-client /build/build-client
COPY --from=build /build/build-server /build/build-server

CMD ["npm", "start"]
