FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including devDependencies for nest CLI)
RUN npm install

COPY . .

# Build using npx
RUN npx nest build

EXPOSE 3000

CMD ["node", "dist/main.js"]
