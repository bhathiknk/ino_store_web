# Use Node.js as base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all other files
COPY . .

# Expose the application port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
