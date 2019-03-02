export default initData => ({
  state() {
    return {
      microcontroller: initData.microcontroller,
      feedingCount: initData.feedingCount,
      maxFeedingCount: initData.maxFeedingCount,
      doublePortion: initData.doublePortion,
      lastFeedingTime: initData.lastFeedingTime,
      feedingInterval: initData.feedingInterval,
      socket: initData.socket,
    };
  },

  mutations: {
    INC_FEEDING_COUNT(state) {
      state.feedingCount += 1;
    },
    RESET_FEED(state) {
      state.feedingCount = 0;
    },
    RESET_LAST_FEEDING_TIME(state) {
      state.lastFeedingTime = Date.now();
    },
    UPDATE_FEEDING_INTERVAL(state, payload) {
      state.feedingInterval = payload;
    },
    TOGGLE_DOUBLE_PORTION(state) {
      state.doublePortion = !state.doublePortion;
    },
  },

  actions: {
    socket_feeding({ commit, state }) {
      const portionsFeedLeft = state.maxFeedingCount - state.feedingCount;

      if (portionsFeedLeft >= 1) {
        if (state.doublePortion) {
          if (portionsFeedLeft < 2) {
            commit('ADD_ALERT', { type: 'info', message: 'pf.enoughServing' }, { root: true });
          } else {
            commit('INC_FEEDING_COUNT');
          }
        }
        commit('INC_FEEDING_COUNT');
        commit('RESET_LAST_FEEDING_TIME');
        commit('ADD_ALERT', { type: 'success', message: 'pf.feeding' }, { root: true });
      }
      if (portionsFeedLeft > 0 && portionsFeedLeft <= 2) {
        commit('ADD_ALERT', { type: 'info', message: 'pf.soonNoFeed' }, { root: true });
      } else if (portionsFeedLeft === 0) {
        commit('ADD_ALERT', { type: 'warning', message: 'pf.noFeed' }, { root: true });
      }
    },

    /** */
    startFeeding({ dispatch }) {
      dispatch('connectionSend', { event: 'startFeeding' });
    },

    newFeedingInterval({ commit, dispatch }, data) {
      const hour = Number(data.substring(0, 2));
      commit('UPDATE_FEEDING_INTERVAL', hour);
      dispatch('connectionSend', { event: 'feedingInterval', data: hour });
    },

    feedUpdated({ commit, dispatch }) {
      dispatch('connectionSend', { event: 'feedUpdated' });
      commit('RESET_FEED');
    },

    doublePortion({ commit, dispatch }, data) {
      dispatch('connectionSend', { event: 'doublePortion', data: Boolean(data) });
      commit('TOGGLE_DOUBLE_PORTION');
    },

    /** */
    event({ dispatch }, payload) {
      dispatch(`socket_${payload.event}`, payload.data);
    },

    connectionSend({ state }, payload) {
      const message = JSON.stringify(payload);
      state.socket.send(message);
    },

    connectionError({ commit }) {
      commit('ADD_ALERT', { type: 'error', message: 'error.disconnect' }, { root: true });
    },
  },

  getters: {},

  namespaced: true,
});
