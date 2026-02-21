FROM oven/bun:1 AS buildjs
WORKDIR /app/client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ ./
RUN bun run build

FROM golang:1.24 AS buildgo
WORKDIR /app
COPY . .
COPY --from=buildjs /app/client/dist /app/client/dist
RUN CGO_ENABLED=0 go build -o ./build/server ./server

FROM alpine:3
WORKDIR /app
COPY --from=buildgo /app/build/server /app/server
EXPOSE 4444
ENTRYPOINT ["/app/server"]
