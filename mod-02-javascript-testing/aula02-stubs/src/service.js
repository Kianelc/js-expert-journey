const fetch = require("node-fetch");

class Service {
  async makeRequest(url) {
    const response = await fetch(url);
    return await response.json();
  }

  async getPlanets(url) {
    const data = await this.makeRequest(url);
    return {
      name: data.name,
      surfaceWater: data.surface_water,
      appeardIn: data.films.length,
    };
  }
}

module.exports = Service;
