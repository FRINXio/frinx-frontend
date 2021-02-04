# --- Build UI ---

FROM node:12-alpine
ENV SASS_BINARY_NAME linux-x64-59
RUN apk --no-cache add curl
RUN apk add --update openssl

# Cache client npm packages
COPY package.json package-lock.json /usr/app/
RUN cd /usr/app/; npm install -qy

# Cache server npm packages
COPY server/package.json package-lock.json /usr/app/server/
RUN cd /usr/app/server/; npm install -qy

# Copy project
WORKDIR /usr/app/
COPY . .
RUN npm install -qy
RUN npm run build
WORKDIR /usr/app/server/
RUN npm install -qy

CMD ["npm", "start"]