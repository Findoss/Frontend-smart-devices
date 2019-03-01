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
    TOGGLE_DOUBLE_PORTION(state) {
      state.doublePortion = !state.doublePortion;
    },
  },

  actions: {
    event({ dispatch }, payload) {
      dispatch(payload.event, payload.data);
    },

    feeding({ commit, state }) {
      if (state.feedingCount !== state.maxFeedingCount) {
        commit('INC_FEEDING_COUNT');
        commit('ADD_ALERT', { type: 'success', message: 'pf.feeding' }, { root: true });
      }
      if (state.feedingCount === state.maxFeedingCount - 1) {
        commit('ADD_ALERT', { type: 'warning', message: 'pf.soonNoFeed' }, { root: true });
      } else if (state.feedingCount === state.maxFeedingCount) {
        commit('ADD_ALERT', { type: 'error', message: 'pf.noFeed' }, { root: true });
      }
    },

    startFeeding({ dispatch }) {
      dispatch('connectionSend', { event: 'startFeeding' });
    },

    newFeedingInterval({ dispatch }, data) {
      dispatch('connectionSend', { event: 'feedingInterval', data });
    },

    feedUpdated({ commit, dispatch }) {
      dispatch('connectionSend', { event: 'feedUpdated' });
      commit('RESET_FEED');
    },

    doublePortion({ commit, dispatch }, data) {
      dispatch('connectionSend', { event: 'doublePortion', data: Boolean(data) });
      commit('TOGGLE_DOUBLE_PORTION');
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
