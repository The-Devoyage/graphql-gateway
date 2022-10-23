FROM node:16.13.2
ARG GITHUB_TOKEN
WORKDIR /app
COPY package*.json ./
COPY .npmrc .npmrc  
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "run", "dev" ]
