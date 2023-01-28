FROM node:19-alpine as build
WORKDIR /build
COPY package.json yarn.lock  ./
RUN yarn
COPY . .
RUN yarn build

FROM node:19-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock  ./
RUN yarn --production

COPY --from=build /build/build ./build
COPY prisma .
RUN npx prisma generate
RUN npx prisma migrate

CMD ["node", "build/server.js"]
