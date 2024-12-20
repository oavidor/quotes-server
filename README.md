# Quotes Server

This project provides a service for fetching and managing quotes using the FavQs API. It includes functionality to save quotes in a local database and fallback to the database if the API rate limit is exceeded.

### Prerequisites

- Node.js (>=16.0.0)
- Docker (for setting up MongoDB), (https://www.docker.com/) must be installed and running on your machine
- FavQs API key (required to interact with the FavQs API)

# clone the repository to your computer

git clone https://github.com/oavidor/quotes-server.git

# access the directory

cd quotes-server

# Install dependencies:

npm install

# env support

1. Rename .env.example to .env or use the command:
   mv .env.example .env
2. If you don't have an api_key from favqs, please register and generate one in https://favqs.com/api_keys , https://favqs.com/api.
3. Replace FAVQS_API_KEY=favqs-api-key-here with your api_key from favqs (https://favqs.com/api_keys)

# db setup with docker

the db is mongo, please run the following commands:

### Install Docker:

Follow the installation guide for your operating system: https://docs.docker.com/get-docker/

# initiating mongo db:
you can use the following command:
npm run start:init instead of the next commands:

# 1. Pull the MongoDB Docker image:

docker pull mongo

# 2. Start a MongoDB container:

docker run --name quotes-mongo -d -p 27017:27017 mongo

# 3. Verify the container is running:

docker ps

# running the server

npm run start
or
nest start

# for testing the server:

in the browser run the following url:

http://localhost:5000/quotes/getRandomQuotes?count=5&filter=funny
