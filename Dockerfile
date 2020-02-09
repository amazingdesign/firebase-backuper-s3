FROM node:13.2.0-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set '@bit:registry' https://node.bit.dev

RUN npm install --production

COPY . .

CMD ["npm", "start"]