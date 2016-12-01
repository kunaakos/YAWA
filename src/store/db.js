
import { App } from 'src/app';

import VuexFire from 'vuexfire';

import firebaseHelper from 'helpers/firebase';

const db = {
  state: {
    cards: null
  },

  actions: {
    db_createCard(context, owmCityId) {
      firebaseHelper.checkForExistingCard(owmCityId).then(() => {
        return firebaseHelper.createCard(owmCityId);
      }).catch((err) => {
        console.log(err);
      });
    },

    db_deleteCard(context, firebaseKey) {
      firebaseHelper.deleteCard(firebaseKey);
    },

    // update sortKey values of cards
    db_updateSortKeys(context, firebaseKeyArray) {
      firebaseHelper.updateSortKeys(firebaseKeyArray);
    },

    db_doFirebaseBindings(context) {
      var userId = context.rootState.auth.user.uid;
      App.$bindAsObject('db.cards', firebaseHelper.db.ref('users/' + userId + '/cards'));
      firebaseHelper.cardsRef = App.$firebaseRefs['db.cards'];
    }
  },

  mutations: VuexFire.moduleMutations('db'),

  getters: {
    db_getCards: state => {
      return state.cards;
    },

    // returns an array containing the unique IDs of cards in the order they
    // should appear on screen
    db_getCardKeys: state => {
      var sortable = [];
      for (var cardKey in state.cards) {
        var card = state.cards[cardKey];
        if (card && card.hasOwnProperty('sortKey')) {
          sortable.push({
            'sortKey': card.sortKey,
            'cardKey': cardKey
          });
        }
      }
      sortable.sort((a, b) => {
        return (a.sortKey > b.sortKey) ? true : false;
      });
      return sortable.map((value) => {
        return value.cardKey;
      });
    },

    db_hasCards: state => {
      if (state) {
        // NOT IMPLEMENTED
      }
      return false;
    }
  }
};

export default db;
