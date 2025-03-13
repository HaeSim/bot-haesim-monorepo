# Dockerfile for NestJS API
FROM node:23.7.0-alpine AS development

# Oracle Instant Client setup
RUN mkdir -p /etc/ld.so.conf.d/
RUN apk --no-cache add libaio libc6-compat curl unzip && \
    curl -o /tmp/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip /tmp/instantclient.zip -d /opt && \
    rm /tmp/instantclient.zip && \
    ln -s /opt/instantclient* /opt/instantclient && \
    echo /opt/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig /opt/instantclient || true

ENV LD_LIBRARY_PATH=/opt/instantclient

WORKDIR /usr/src/app

# Copy workspace files for monorepo
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# Add yarn network timeout and retry options to fix installation issues 
RUN yarn config set network-timeout 300000 && \
    yarn install --network-timeout 300000 --frozen-lockfile --network-concurrency 1

# Copy source code
COPY . .

# Build application - with additional TypeScript options
ENV PATH="./node_modules/.bin:$PATH"
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn workspace api build

# Production stage
FROM node:23.7.0-alpine AS production

# Oracle Instant Client setup
RUN mkdir -p /etc/ld.so.conf.d/
RUN apk --no-cache add libaio libc6-compat curl unzip && \
    curl -o /tmp/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip /tmp/instantclient.zip -d /opt && \
    rm /tmp/instantclient.zip && \
    ln -s /opt/instantclient* /opt/instantclient && \
    echo /opt/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig /opt/instantclient || true

ENV LD_LIBRARY_PATH=/opt/instantclient
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/
RUN yarn config set network-timeout 300000 && \
    yarn install --production=true --network-timeout 300000 --frozen-lockfile --network-concurrency 1

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/views ./views
COPY --from=development /usr/src/app/public ./public

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/health || exit 1

CMD ["node", "dist/main"]