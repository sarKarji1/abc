FROM node:lts-buster

# Clone the repository
RUN git clone https://github.com/sarKarji1/abc.git /root/abc

# Set the working directory
WORKDIR /root/abc

# First try using yarn install, then install pm2 globally via npm
RUN npm install

# Install pm2 globally if needed
RUN npm install -g pm2

# Copy all files to the container
COPY . .

# Expose port
EXPOSE 9090

# Start the application
CMD ["yarn", "start"]
