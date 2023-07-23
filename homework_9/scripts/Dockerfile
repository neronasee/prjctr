# Use the official Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Node.js application files
COPY . .

# Run the Node.js script
CMD ["node", "insert_users.js"]
