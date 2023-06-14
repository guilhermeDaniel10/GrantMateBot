FROM node:18-alpine

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=16384

COPY package.json ./
COPY package-lock.json ./

RUN npm i && mkdir /usr/ui && cp -R ./node_modules ./usr/ui

WORKDIR /usr/ui


COPY . .

EXPOSE 4200

CMD [ "npm", "run", "start" ]
