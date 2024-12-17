# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files, including seed.js
COPY . .

# Expose server port
EXPOSE 5000

# Default command to run server
CMD ["node", "src/server.js","npm", "run", "dev"]
