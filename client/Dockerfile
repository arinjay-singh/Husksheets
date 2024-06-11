#@author Kaan Tural
# Use the official Node.js 18.17.0 image as a parent image
FROM node:18.17.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the application runs on (if applicable)
EXPOSE 3000

# Set the working directory to where the tests are located
WORKDIR /app/client/test

# Install test dependencies
RUN npm install

# Command to run the application
CMD ["npm", "run", "dev"]