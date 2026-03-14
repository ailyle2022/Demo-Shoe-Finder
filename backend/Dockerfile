FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies
RUN npm install

COPY . .

# Build using node_modules/.bin/nest
RUN node ./node_modules/@nestjs/cli/bin/nest.js build

EXPOSE 3000

CMD ["node", "dist/main.js"]
