FROM node:20-alpine

WORKDIR ./server

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

EXPOSE 3056

EXPOSE 5555

#RUN npm run build

ENTRYPOINT ["sh", "./backscript.sh"]

CMD ["npm", "run", "build"]