FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Put files into the relative work dir
COPY . .
# cmd to copy /uploads to /uploadstemp maybe
CMD [ "mkdir", "uploadstemp" ]
COPY ./uploads ./uploadstemp

### COMMANDS

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]