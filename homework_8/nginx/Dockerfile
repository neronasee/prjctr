# Base image (choose an appropriate base image for your needs)
FROM ubuntu:latest as builder

# Install necessary tools
RUN apt-get update && apt-get install -y curl wget

# Set the working directory
WORKDIR /app

# Download nginx-cache-purge and make it executable
RUN (curl -s https://api.github.com/repos/magiclen/nginx-cache-purge/releases/latest | sed -r -n 's/.*"browser_download_url": *"(.*\/nginx-cache-purge_'$(uname -m)')".*/\1/p' | wget -i -)  \
    && mv nginx-cache-purge_$(uname -m) /usr/local/bin/nginx-cache-purge \
    && chmod +x /usr/local/bin/nginx-cache-purge

# Stage 2: Final OpenResty Image
FROM openresty/openresty:latest

# Copy nginx-cache-purge from the builder stage
COPY --from=builder /usr/local/bin/nginx-cache-purge /usr/local/bin/nginx-cache-purge

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Add the entrypoint
ENTRYPOINT ["nginx", "-g", "daemon off;"]
