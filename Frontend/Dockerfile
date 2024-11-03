FROM node:16

ENV VITE_BACKEND_API_URL "http://afresh.farm:8000/api/v2"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build
