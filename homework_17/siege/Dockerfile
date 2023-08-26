FROM debian:buster-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y siege && \
    rm -rf /var/lib/apt/lists/*

COPY urls.txt .
COPY payload.json .

ENTRYPOINT ["siege"]