FROM ubuntu:latest

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    wget \
    make \
    gcc \
    perl \
    zlib1g-dev \
    libssl-dev \
    libmaxminddb-dev \
    libgeoip-dev \
    libpcre3-dev \
    unzip \
    patch

# Define environment variables
ENV NGX_HTTP_UPSTREAM_CHECK 0.4.0
ENV GEOIP2_MODULE_VERSION 3.3
ENV NGINX_VERSION 1.20.1

# Download specific nginx version
RUN wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz && \
    tar -xvzf nginx-$NGINX_VERSION.tar.gz

# Download nginx_upstream_check_module
RUN wget https://github.com/yaoweibin/nginx_upstream_check_module/archive/v$NGX_HTTP_UPSTREAM_CHECK.tar.gz && \
    tar -xvzf v$NGX_HTTP_UPSTREAM_CHECK.tar.gz

# Apply appropriate patch for nginx_upstream_check_module
RUN cd nginx-$NGINX_VERSION && \
    patch -p1 < ../nginx_upstream_check_module-$NGX_HTTP_UPSTREAM_CHECK/check_1.20.1+.patch


# Download GeoIP2 module
RUN wget https://github.com/leev/ngx_http_geoip2_module/archive/$GEOIP2_MODULE_VERSION.tar.gz && \
    tar -xvzf $GEOIP2_MODULE_VERSION.tar.gz


# Compile nginx
RUN cd nginx-$NGINX_VERSION && \
    ./configure \
    --with-http_geoip_module \
    --add-module=../ngx_http_geoip2_module-$GEOIP2_MODULE_VERSION \
    --add-module=../nginx_upstream_check_module-$NGX_HTTP_UPSTREAM_CHECK && \
    make && make install

# Copy configuration files
COPY nginx.conf /usr/local/nginx/conf/nginx.conf

RUN mkdir -p /var/lib/GeoIP/
COPY GeoLite2-Country.mmdb /var/lib/GeoIP/GeoLite2-Country.mmdb

# Forward nginx logs
RUN ln -sf /dev/stdout /usr/local/nginx/logs/access.log \
	&& ln -sf /dev/stderr /usr/local/nginx/logs/error.log

EXPOSE 80 443

# Start nginx as a foreground process
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]