FROM node
WORKDIR /opt/app
USER root
# ADD *.json ./
# RUN npm install
ADD . .
ENV NODE_ENV=production
RUN npm install
RUN npm run build

# FROM node:18-alpine3.16
# WORKDIR /opt/app
# ADD package.json ./
# RUN npm install --only=prod
# COPY --from=build /opt/app/dist ./dist

# CMD ["npm", "run", "start:prod"]
CMD ["npm", "./dist/main.js"]
#EXPOSE 7000