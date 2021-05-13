FROM buildkite/puppeteer

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8080

ENV PROFILE=dev

CMD [ "sh", "-c", "node dist/app.js ${PROFILE}"]