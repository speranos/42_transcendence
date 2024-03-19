FROM node:20-alpine

WORKDIR /usr/src

COPY package*.json /usr/src/

RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 3056

# npm run dev
CMD ["npm", "run", "build"]

#RUN npm run build