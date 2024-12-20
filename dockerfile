FROM node:20

WORKDIR /src

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]