FROM node:lts-buster
RUN git clone https://github.com/sarKarji1/abc/root/abc
WORKDIR /root/abc
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
