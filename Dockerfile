FROM node:12.19.0-alpine3.9 AS development
USER node
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:12.19.0-alpine3.9 as production
USER node
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]


# FROM node:16-alpine as builder
# ENV NODE_ENV build
# USER node
# WORKDIR /home/node
# COPY package*.json ./
# RUN npm ci
# COPY --chown=node:node . .
# RUN npm run build \
#     && npm prune --production

# # ---

# FROM node:16-alpine

# ENV NODE_ENV production

# USER node
# WORKDIR /home/node

# COPY --from=builder --chown=node:node /home/node/package*.json ./
# COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
# COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# CMD ["node", "dist/server.js"]