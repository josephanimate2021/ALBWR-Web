FROM node

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy the src folder to the app directory
COPY ./src ./

# Installs node packages.
RUN npm install ws

## Exposes a port number
EXPOSE 80

# Starts the app
CMD [ "node", "index.js" ]
