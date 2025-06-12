# Use official Node.js 22 image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose backend port
EXPOSE 5000

# Run the built app
CMD ["node", "dist/server.js"]
