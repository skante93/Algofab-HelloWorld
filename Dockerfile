# Base image from which we construct our own
FROM ubuntu:16.04

# Update the image and install the tools we need
RUN apt-get update -y && apt-get install -y nodejs-legacy npm curl nano


# Create Hello-World folder in the Image and copy the contents from my HOST to the Image
RUN mkdir /Hello-World-Package
COPY .  /Hello-World-Package

# Chane the current working directory
WORKDIR /Hello-World-Package/Hello-World

#RUN pwd
#RUN ls -la

# Update nodejs version
RUN bash ../update-node.sh


# Command executed each time a container created from this image is started
CMD node app.js