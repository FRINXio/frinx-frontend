
FROM node:8.9-alpine

# Create a work directory and copy dependency files.
RUN mkdir /app
WORKDIR /app
COPY /src /app/src
COPY ["package.json", "package-lock.json*", "./"]

# Building modules
RUN npm install --silent --production && mv node_modules ../

# Expose PORT 3000 on virtual machine
EXPOSE 3000