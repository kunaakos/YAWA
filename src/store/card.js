import Vue from 'vue';

import firebaseHelper from 'helpers/firebase';
import owmHelper from 'helpers/owm';

class Card {
  constructor() {
    // data from firebase
    this.owmCityId = null;
    this.tempThresholds = {
      maxC: false,
      minC: false
    };
    // data from OpenWeatherMap
    this.locationName = null;
    this.currentTemp = null;
    this.currentConditions = null;
    this.isDark = null;
    this.isLit = false;
    // last OWM update timestamp
    this.lastUpdate = null;
  }
}

const card = {
  state: {
    cards: {},
    order: [],
    gotFbData: false
  },

  // action name pattern: card__[property]_[action]
  actions: {

    card__cards_add(context, owmCityId) {
      firebaseHelper._check(owmCityId).then(() => {
        return firebaseHelper._add(owmCityId);
      }).catch(() => {
        // TODO: handle error
      });
      // mutations will be commited by firebaseHelper
    },

    card__cards_delete(context, key) {
      firebaseHelper._delete(key);
      // mutations will be commited by firebaseHelper
    },

    card__cards_thresh_set(context, data) {
      firebaseHelper._setThresh(data.key, data.type, data.val);
      // mutations will be commited by firebaseHelper
    },

    // set the sort order of the cards
    // keyArray is a simple array with firebase keys of cards in the order they
    // should appear on screen
    card__order_set(context, keyArray) {
      firebaseHelper._setOrder(keyArray);
      // mutations will be commited by firebaseHelper
    },

    // update the weather data of the card
    card__cards_weatherUpdate(context, key) {
      owmHelper.getWeatherDataById(context.state.cards[key].owmCityId).then((owmData) => {
        // update card with data from OpenWeatherMap
        context.commit('card_m_owm__update', {
          'key': key,
          'value': owmData
        });
      });
    },

  },

  // mutation name pattern: card_m_[helper]__[property]_[action]
  mutations: {

    card_m_fb__cards_add: (state, key) => {
      // create a card!
      Vue.set(state.cards, key, new Card());
    },

    // update the properties of a single card, values from firebase ONLY
    card_m_fb__cards_update: (state, data) => {
      state.cards[data.key].owmCityId = data.value.owmCityId;
      state.cards[data.key].tempThresholds = data.value.tempThresholds;
    },

    card_m_fb__cards_remove: (state, key) => {
      delete state.cards[key];
    },

    card_m_fb__order_set: (state, keyArray) => {
      state.order = keyArray;
      state.gotFbData = true;
    },

    // clear all data after unauth
    card_m_fb__nuke: (state) => {
      state.cards = {};
      state.order = [];
    },

    // update the properties of a single card, values from OpenWeatherMap ONLY
    card_m_owm__update: (state, data) => {
      state.cards[data.key].locationName = data.value.locationName;
      state.cards[data.key].currentTemp = data.value.currentTemp;
      state.cards[data.key].currentConditions = data.value.currentConditions;
      state.cards[data.key].isDark = data.value.isDark;
      state.cards[data.key].lastUpdate = Date.now();
    },

  },

  // getter name pattern: card_g__[property]
  getters: {
    card_g__cards: state => {
      return state.cards;
    },
    card_g__order: state => {
      return state.order;
    },
    card_g__gotFbData: state => {
      return state.gotFbData;
    },
  }
};

export default card;
