FROM node:22.13.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -silent

COPY . .

CMD ["npm", "start"]