FROM node:16

WORKDIR /app/AURAMART-FRONTEND/client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]