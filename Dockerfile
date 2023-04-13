# Stage 1: Build the React app
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
COPY firebase.json ./
RUN yarn install --frozen-lockfile
COPY . .
COPY .env .
RUN yarn build

EXPOSE 80

# Start the application
CMD ["yarn", "start"]

# Stage 2: Serve the built app
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]