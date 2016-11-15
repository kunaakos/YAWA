import Vue from 'vue';
import VueResource from 'vue-resource';

// import { router } from 'src/main';

const API_BASE = 'http://api.openweathermap.org/data/2.5';
const API_KEY = 'f37343549ea4135c63a784ad005a08e9';

Vue.use(VueResource);

Vue.http.options = {
  root: API_BASE
};

var weather = {
  state: {
    result: null
  },
  getCities(queryString, maxLen) {
    // discard values we don't need
    function processResult(result) {
      var processedResult = {};
      // return name and id
      processedResult.name = result.name;
      processedResult.id = result.id;
      return processedResult;
    }
    // promise wrapped in a promise ¯\_(ツ)_/¯
    return new Promise(function(resolve, reject) {
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
        resolve(response.data.list.map(processResult));
      }, (errorResponse) => {
        console.log('weather API responded with:', errorResponse.status);
        reject(null);
      });

    });

  }
};

export default weather;
