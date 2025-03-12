# Dockerfile for NextJS Web
FROM node:23.7.0-alpine AS development

WORKDIR /usr/src/app

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN yarn config set network-timeout 300000 && \
    yarn install --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY . .

EXPOSE 3000

CMD ["yarn", "workspace", "web", "dev"]

# Production build stage
FROM node:23.7.0-alpine AS build

WORKDIR /usr/src/app

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN yarn config set network-timeout 300000 && \
    yarn install --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY . .
RUN yarn workspace web build

# Production runtime stage
FROM node:23.7.0-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN yarn config set network-timeout 300000 && \
    yarn install --production=true --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY --from=build /usr/src/app/apps/web/.next ./apps/web/.next
COPY --from=build /usr/src/app/apps/web/public ./apps/web/public
COPY --from=build /usr/src/app/apps/web/next.config.* ./apps/web/

EXPOSE 3000

CMD ["yarn", "workspace", "web", "start"]