FROM node:19-alpine as packages
WORKDIR /app
COPY package.json yarn.lock  ./
RUN yarn --production

FROM packages
COPY . .
ENV NODE_ENV=staging
RUN yarn build

CMD ["yarn", "run:prod"]
