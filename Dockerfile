
FROM node:8.9-alpine

ARG ODL

# Create a work directory and copy dependency files.
COPY ["package.json", "package-lock.json*", "/tmp/"]
RUN cd /tmp && npm install --silent


RUN mkdir /app && cp -r /tmp/node_modules /app

WORKDIR /app
COPY . /app

RUN sed -i 's,.*ODL_HOST=.*,ODL_HOST='"http://""${ODL}"',' ./.env

# Expose PORT 3000 on virtual machine
EXPOSE 3000
