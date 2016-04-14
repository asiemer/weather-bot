FROM node:argon

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#install botkit
RUN npm install botkit --save
COPY bot.js /usr/src/app/
COPY package.json /usr/src/app/

CMD ["node", "bot"]
