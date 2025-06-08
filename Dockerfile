# Use official Node.js LTS image
FROM node:lts-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Build the NestJS app (compiles TS to JS)
RUN npm run build

# Start the app from the built output folder
CMD ["node", "dist/main.js"]