FROM node:latest

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=16384

COPY package*.json ./
RUN npm i && mkdir /usr/app && cp -R ./node_modules ./usr/app

WORKDIR /usr/app
COPY . .

# Use the existing "file-storage" volume for storing files
VOLUME ["file-storage:/usr/app/file-storage"]

# Add a script to wait for the database
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /wait-for-it.sh
# Set the permissions for the script
RUN chmod +x /wait-for-it.sh

# Start the application with wait-for-it
CMD ["/wait-for-it.sh", "${DB_HOST}:${DB_PORT}", "--timeout=30", "--", "npm", "run", "dev"]