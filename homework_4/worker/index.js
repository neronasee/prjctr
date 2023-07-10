const axios = require("axios");

const cityName = "Kyiv";
const measurementId = process.env.MEASUREMENT_ID;
const gaApiSecret = process.env.API_SECRET;
const weatherApiSecret = process.env.WEATHER_API_SECRET;

if (!measurementId || !gaApiSecret || !weatherApiSecret) {
  console.error(
    "Measurement ID, Weather API secret or GA Api Secret was not found. Exiting"
  );
  process.exit(1);
}

async function getTemperature(cityName) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiSecret}`;

  try {
    const response = await axios.get(url);

    const tempInKelvin = response.data.main.temp;
    const tempInCelsius = tempInKelvin - 273.15;

    return tempInCelsius;
  } catch (error) {
    console.error("Error getting weather data:", error);
  }
}

async function sendDataToGA() {
  const temp = await getTemperature(cityName);

  // Set up the event data
  const eventData = {
    client_id: "weather_station_1",
    events: [
      {
        name: "weather_update",
        params: {
          temperature: temp,
        },
      },
    ],
  };

  // Define the Measurement Protocol API endpoint
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${gaApiSecret}`;

  try {
    const response = await axios.post(url, eventData);
    console.log("Response:", response.status, response.statusText);
  } catch (error) {
    console.error("Error sending data to GA4:", error);
  }
}

// Send data to GA4 every 30 minutes
setInterval(sendDataToGA, 30 * 60 * 1000);
