FROM golang:1.10-alpine3.7
MAINTAINER Dionys Rosario <chuongnx@gmail.com>

RUN apk add --no-cache git gcc g++ \
 && go get -u github.com/chuongnx/beego \
 && go get -u github.com/beego/bee \
    && go get -u github.com/chuongnx/golang-cms

EXPOSE 8080 8088

# Start app
CMD sh $GOPATH/src/github.com/chuongnx/golang-cms/run.sh
