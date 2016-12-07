// may the flying spaghetti monster in his holy noodliness bless you in your present endeavour...

import Vue from 'vue';
import VueResource from 'vue-resource';

const API_BASE = 'http://api.openweathermap.org/data/2.5';
const API_KEY = 'f37343549ea4135c63a784ad005a08e9';
// const API_KEY = 'c1f017e502a92e9deba979867fc29de6';

Vue.use(VueResource);

Vue.http.options = {
  root: API_BASE
};

var owmHelper = {
  state: {
    result: null
  },
  // get weather data based on OpenWeatherMapCityId
  getWeatherDataById(owmCityId) {
    // discard values we don't need
    function processResult(result) {
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
      // a few simple values will do
      var description = '';

      switch (parseInt(iconData[1])) {
        case 1:
          description = 'clear';
          break;
        case 2:
        case 3:
        case 4:
          description = 'cloudy';
          break;
        case 9:
        case 10:
          description = 'rainy';
          break;
        case 11:
          description = 'thunderstorm';
          break;
        case 13:
          description = 'snow';
          break;
        case 50:
          description = 'low-viz';
          break;
        default:
          description = 'error';
      }

      var processedResult = {
        name: result.name,
        currentTemp: Math.round(result.main.temp * 10) / 10,
        description: description,
        night: (iconData[2] === 'd') ? false : true
      };

      // whoo-ey, was THAT a mess.
      return processedResult;
    }
    // promise wrapped in a promise ¯\_(ツ)_/¯
    return new Promise(function(resolve, reject) {
      Vue.resource('weather?id={cityId}&units=metric&APPID={apiKey}')
      .get({
        cityId: owmCityId,
        apiKey: API_KEY
      })
      .then((response) => {
        // process result
        resolve(processResult(response.data));
      }, (errorResponse) => {
        console.log('weather API responded with:', errorResponse.status);
        reject(null);
      });
    });
  },
  // return a list of cities based on queryString
  getCities(queryString, maxLen) {
    // discard values we don't need
    function processResult(result) {
      var processedResult = {};
      // return name and id
      processedResult.name = result.name;
      processedResult.id = result.id;
      // not all locations have two letter country codes...
      processedResult.countryCode = (result.sys.country.length > 2)
        ? result.sys.country.toUpperCase().substr(0, 3) + '.'
        : result.sys.country;
      return processedResult;
    }
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
          result: response.data.list.map(processResult),
          resultToken: resultToken
        });
      }, (errorResponse) => {
        console.log('weather API responded with:', errorResponse.status);
        reject(null, resultToken);
      });
    });
    return { resultPromise, resultToken };
  }
};

export default owmHelper;

// R'Amen.
