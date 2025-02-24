FROM node:lts-buster
RUN git clone https://github.com/sarKarji1/abc.git /root/abc
WORKDIR /root/abc
RUN yarn install && yarn install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["yarn", "start"]
