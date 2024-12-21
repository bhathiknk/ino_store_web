# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the port for the server
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
