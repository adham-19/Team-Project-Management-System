# Use an official Node.js runtime environment
FROM node:20-alpine

# Set the working directory inside the container to your server subfolder
WORKDIR /app/server

# Copy only the package files first to leverage Docker layer caching
COPY server/package*.json ./

# Install production dependencies inside the container
RUN npm ci --only=production

# Copy the rest of your server source code
COPY server/ .

# Expose the application port (Railway sets this dynamically, but good for reference)
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]
