# Dockerfile for NextJS Web
FROM node:23.7.0-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]

# Production build stage
FROM node:23.7.0-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production runtime stage
FROM node:23.7.0-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./
RUN yarn install --frozen-lockfile --production=true

COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/next.config.ts ./

EXPOSE 3000

CMD ["yarn", "start"]