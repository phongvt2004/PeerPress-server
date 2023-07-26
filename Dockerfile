FROM node:19.7-alpine

WORKDIR /usr/src/app

LABEL server="peer-press"

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]