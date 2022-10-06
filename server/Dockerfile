FROM node:16

RUN apt-get update
RUN apt-get install zip -y

VOLUME /output
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build:src
RUN npm install --omit=dev
RUN cp -rf node_modules dist/node_modules
RUN zip -9yr lambda.zip ./dist/

ENTRYPOINT ["cp", "lambda.zip", "/output/lambda.zip"]