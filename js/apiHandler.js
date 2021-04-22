const axios = require('axios').default;

class ApiHandler {
  constructor() {
    this.host = process.env.APIHOST;
    this.key = process.env.APIKEY;
    this.pattern = 'https://weatherapi-com.p.rapidapi.com/forecast.json';
  }

  getResponseInJSON(json) {
    const { current, location } = json;
    return {
      city: location.name,
      coords: {
        lat: location.lat,
        lon: location.lon,
      },
      temp: `${Math.round(current.temp_c)}°C`,
      wind: `${current.wind_mph} m/s, ${current.wind_dir}`,
      cloud: `${current.cloud} %`,
      press: `${current.pressure_mb} hpa`,
      humidity: `${current.humidity} %`,
      icon: current.condition.icon.replace(/64x64/i, '128x128'),
    };
  }

  async getWeatherInfo(cityorCoords) {
    const options = {
      method: 'GET',
      url: this.pattern,
      params: { q: cityorCoords.replace(' ', '%20') },
      headers: {
        'x-rapidapi-key': this.key,
        'x-rapidapi-host': this.host,
      },
    };
    const response = await axios.request(options);
    return this.getResponseInJSON(response.data);
  }

  async getCities(cities){ return await Promise.all(cities.map(city => { return this.getWeatherInfo(city); })); }
}

module.exports = ApiHandler;