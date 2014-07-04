# Pull base image.
FROM dockerfile/ubuntu

# System update and install
RUN apt-get -y --force-yes update
RUN apt-get -y --force-yes install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Clone the application repo and install it
WORKDIR /opt
RUN git clone https://github.com/AutoDevBot/API-Monitor-Runner.git
WORKDIR /opt/API-Monitor-Runner
RUN npm install
RUN npm install jasmine-node -g
RUN npm install forever -g

# Start API monitoring server
CMD ["forever", "app.js"]