FROM node:14

# Let WatchTower know to ignore this container for checking
# LABEL com.centurylinklabs.watchtower.enable="false"

WORKDIR /app

COPY ./package*.json .

RUN rm -rf node_modules package-lock.json && yarn install

COPY . .

ENV NODE_ENV production
ENV APP_KEYS=${APP_KEYS}
ENV API_TOKEN_SALT=${API_TOKEN_SALT}
ENV ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SSL=${DATABASE_SSL}

RUN yarn build

EXPOSE 1337

CMD ["yarn", "develop"]