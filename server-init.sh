#!/bin/bash

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Error: Docker is not installed. Please install Docker before running this script." >&2
  exit 1
fi

# Start MongoDB container if not running
if [ ! "$(docker ps -q -f name=quotes-mongo)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=quotes-mongo)" ]; then
        # Start the existing container
        docker start quotes-mongo
    else
        # Pull and run MongoDB if not already done
        docker pull mongo
        docker run --name quotes-mongo -d -p 27017:27017 mongo
    fi
fi