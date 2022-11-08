FROM node:18-alpine3.16 as build
WORKDIR /opt/app
ADD *.json ./
RUN npm install && npm install -g npm@8.19.3
ADD . .
ENV NODE_ENV=production
RUN npm run build

FROM node:18-alpine3.16
WORKDIR /opt/app
ADD package.json ./
RUN npm install --only=prod
COPY --from=build /opt/app/dist ./dist

# CMD ["npm", "run", "start:prod"]
CMD ["npm", "./dist/main.js"]
#EXPOSE 7000