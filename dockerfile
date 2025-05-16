# Stage 1: Build the application using Node and Yarn
FROM node:22-alpine AS build
WORKDIR /app
# Copy only package files to leverage Docker cache
COPY package.json yarn.lock ./
RUN yarn install
# Copy the rest of the files and build the project
COPY . .
RUN yarn build

# Stage 2: Serve the built app with NGINX
FROM nginx:stable-alpine
# Remove default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]