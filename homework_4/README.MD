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

## Check it in Looker Studio

https://lookerstudio.google.com/u/0/reporting/23a05078-a056-480d-802c-bcd9fe6508f0/page/vDeWD
