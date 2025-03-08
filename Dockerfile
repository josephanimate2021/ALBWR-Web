FROM node

# Install Rust nightly
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly

# Add Rust to the PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Verify the installation
RUN rustc --version

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy the src folder to the app directory
COPY ./src ./

# Installs node packages.
RUN npm install

## Exposes a port number
EXPOSE 80

# Starts the app
CMD [ "node", "index.js" ]
