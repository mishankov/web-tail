FROM golang:1.23 as buildGo
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o ./build/server ./server


FROM node:22 as buildJs
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build:js


FROM alpine:latest
WORKDIR /app
COPY --from=buildGo /app/build/server /app/server
COPY --from=buildJs /app/dist /app/dist
EXPOSE 4444
ENTRYPOINT ["/app/server"]
