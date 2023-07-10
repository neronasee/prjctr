# Homework 4

## Description

The worker sends weather data to GA4 every 30 minutes

## Run steps
- `cp configuration_example.env configuration.env`
- populate `configuration.env` with your credentials:
    - `MEASUREMENT_ID` - GA4 measurement ID
    - `API_SECRET` - GA4 api secret
    - `WEATHER_API_SECRET` - `openweathermap` api secret
- `cd worker && npm i`
- `docker compose up`
