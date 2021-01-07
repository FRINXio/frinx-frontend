FROM nginx:alpine

EXPOSE 5000

RUN apk add yarn

WORKDIR /frinx-frontend
COPY . .

RUN yarn install --frozen-lockfile && yarn cache clean

# TODO there should be a build for whole repo, not an individual project
RUN cd frinx-dashboard && yarn build

RUN rm -rf /usr/share/nginx/html
RUN cp nginx.conf /etc/nginx/nginx.conf

# TODO we should have static code generated for the whole repo, not an individual project
RUN cp -avr frinx-dashboard/build/dashboard /usr/share/nginx/html
