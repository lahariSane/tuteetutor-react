FROM node:22.13.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -silent

COPY . .

EXPOSE 5000

CMD ["npm", "start"]