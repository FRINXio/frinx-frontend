# --- Build UI ---

FROM node:9.4.0-alpine
ENV SASS_BINARY_NAME linux-x64-59
RUN apk --no-cache add curl
WORKDIR /usr/app/
COPY . .
RUN npm install -qy
RUN npm run build
WORKDIR /usr/app/server/
RUN npm install -qy

EXPOSE 4000

CMD ["npm", "start"]