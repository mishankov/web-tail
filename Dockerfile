FROM golang:1.24 AS buildgo
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o ./build/server ./server


FROM node:22 AS buildjs
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build:js


FROM alpine:3
WORKDIR /app
ENV ASSETS=/app/dist/public
COPY --from=buildgo /app/build/server /app/server
COPY --from=buildjs /app/dist /app/dist
EXPOSE 4444
ENTRYPOINT ["/app/server"]
