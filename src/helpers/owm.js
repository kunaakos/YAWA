// may the flying spaghetti monster in his holy noodliness bless you in your present endeavour...

import Vue from 'vue';
import VueResource from 'vue-resource';

const API_BASE = 'http://api.openweathermap.org/data/2.5';
const API_KEY = 'f37343549ea4135c63a784ad005a08e9';

Vue.use(VueResource);

Vue.http.options = {
  root: API_BASE
};

var owmHelper = {
  _processWeatherData(result) {
    // OpenWeatherMap icon codes:
    // NNd day
    // NNn night
    // 01X clear sky
    // 02X few clouds
    // 03X scattered clouds
    // 04X broken clouds
    // 09X shower rain
    // 10X rain
    // 11X thunderstorm
    // 13X snow
    // 50X mist
    // let's make use of them!
    var iconCodeRegEx = new RegExp(/^(\d{2})(\D{1})$/, 'g');
    var iconData = iconCodeRegEx.exec(result.weather[0].icon);

    // return a word that describes the current weather conditions
    // must be user-readable, for eventual use in views
    var currentConditions = '';

    switch (parseInt(iconData[1])) {
      case 1:
        currentConditions = 'clear';
        break;
      case 2:
      case 3:
      case 4:
        currentConditions = 'cloudy';
        break;
      case 9:
      case 10:
        currentConditions = 'rainy';
        break;
      case 11:
        currentConditions = 'thunderstorm';
        break;
      case 13:
        currentConditions = 'snow';
        break;
      case 50:
        currentConditions = 'low-viz';
        break;
      default:
        currentConditions = 'error';
    }

    var processedResult = {
      locationName: result.name,
      currentTemp: Math.round(result.main.temp * 10) / 10,
      currentConditions: currentConditions,
      isDark: (iconData[2] === 'd') ? false : true
    };

    // whoo-ey, was THAT a mess.
    return processedResult;
  },

  // get weather data based on OpenWeatherMapCityId
  getWeatherDataById(owmCityId) {
    var self = this;
    // promise wrapped in a promise ¯\_(ツ)_/¯
    return new Promise(function(resolve, reject) {
      Vue.resource('weather?id={cityId}&units=metric&APPID={apiKey}')
      .get({
        cityId: owmCityId,
        apiKey: API_KEY
      })
      .then((response) => {
        // process result
        resolve(self._processWeatherData(response.data));
      }, (errorResponse) => {
        reject(errorResponse);
      });
    });
  },

  _processCities(result) {
    var processedResult = {};
    // return name and id
    processedResult.name = result.name;
    processedResult.id = result.id;
    // not all locations have two letter country codes...
    processedResult.countryCode = (result.sys.country.length > 2)
      ? result.sys.country.toUpperCase().substr(0, 3) + '.'
      : result.sys.country;
    return processedResult;
  },

  // return a list of cities based on queryString
  getCities(queryString, maxLen) {
    var self = this;
    // assign a token to each search, so we can identify the results of the last one
    var resultToken = Date.now();
    // promise wrapped in a promise ¯\_(ツ)_/¯
    var resultPromise = new Promise(function(resolve, reject) {
      Vue.resource('find?q={queryString}&mode=json&type=like&APPID={apiKey}')
      .get({
        queryString: queryString,
        apiKey: API_KEY
      })
      .then((response) => {
        // truncate
        if (response.data.count > maxLen) {
          response.data.list = response.data.list.slice(0, maxLen);
        }
        // process result
        resolve({
          result: response.data.list.map(self._processCities),
          resultToken: resultToken
        });
      }, (errorResponse) => {
        reject({
          result: errorResponse,
          resultToken: resultToken
        });
      });
    });
    return { resultPromise, resultToken };
  }
};

export default owmHelper;

// R'Amen.
