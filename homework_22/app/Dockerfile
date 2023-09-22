# Use a base image. Node.js in this case.
FROM node:16

# Set a working directory
WORKDIR /app

# Copy your benchmark files and any other necessary files
COPY . .

# Install your project's dependencies
# RUN npm install

# Define a default command to run your benchmarks
CMD ["node", "index.js"]
