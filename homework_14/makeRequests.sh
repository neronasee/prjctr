#!/bin/sh

for i in $(seq 1 10); do
  echo "Request $i:"
  response=$(curl -si http://projector.example)
  body=$(echo "$response" | awk '/<body>/,/<\/body>/{ print $0 }')
  x_proxy_cache=$(echo "$response" | grep 'X-Proxy-Cache')

  echo "$body"
echo "$x_proxy_cache"

  sleep 1 # Optional: adds a 1-second delay between requests
done
