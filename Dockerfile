FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4444
CMD [ "npm", "run", "start" ]
