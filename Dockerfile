# Use the alpine Node.js 16 image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install  --force

# Copy the rest of the application source code to the container
COPY .  .

# Expose the port  Nest.js application is listening on
EXPOSE 3000

# Command to start your Nest.js application
CMD [ "npm", "run", "start:prod" ]