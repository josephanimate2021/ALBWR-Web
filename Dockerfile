FROM node

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy the src folder to the app directory
COPY ./src ./

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN sudo apt install -y make python build-essential && npm install

EXPOSE 3000

# Start the app using serve command
CMD [ "node", "index.js" ]
