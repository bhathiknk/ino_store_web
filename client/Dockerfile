# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose React development server port
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]