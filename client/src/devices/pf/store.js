import { DateTime, Interval } from 'luxon';

export default initData => ({
  state() {
    return {
      name: initData.microcontroller,
      feedingCount: initData.feedingCount,
      maxFeedingCount: initData.maxFeedingCount,
      doublePortion: initData.doublePortion,
      lastFeedingTime: initData.lastFeedingTime,
      feedingInterval: initData.feedingInterval,

      socket: initData.socket,

      nextFeedingTime: '',
      idTimerNextFeeding: null,
    };
  },

  mutations: {
    SET_NEXT_FEEDING_TIME(state, number) {
      state.nextFeedingTime = number;
    },

    SET_TIMER(state, id) {
      state.idTimerNextFeeding = id;
    },

    DEL_TIMER(state) {
      clearInterval(state.idTimerNextFeeding);
      state.idTimerNextFeeding = null;
    },

    INC_FEEDING_COUNT(state) {
      state.feedingCount += 1;
    },

    RESET_FEED(state) {
      state.feedingCount = 0;
    },

    RESET_LAST_FEEDING_TIME(state) {
      state.lastFeedingTime = Date.now();
    },

    UPDATE_FEEDING_INTERVAL(state, number) {
      state.feedingInterval = number;
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
            commit(
              'ADD_ALERT',
              { type: 'info', message: 'pf.enoughServing', device: state.name },
              { root: true },
            );
          } else {
            commit('INC_FEEDING_COUNT');
          }
        }
        commit('INC_FEEDING_COUNT');
        commit('RESET_LAST_FEEDING_TIME');
        commit(
          'ADD_ALERT',
          { type: 'success', message: 'pf.feeding', device: state.name },
          { root: true },
        );
      }
      if (portionsFeedLeft > 0 && portionsFeedLeft <= 2) {
        commit(
          'ADD_ALERT',
          { type: 'info', message: 'pf.soonNoFeed', device: state.name },
          { root: true },
        );
      } else if (portionsFeedLeft <= 0) {
        commit(
          'ADD_ALERT',
          { type: 'warning', message: 'pf.noFeed', device: state.name },
          { root: true },
        );
      }
    },

    /** */
    startFeeding({ dispatch }) {
      dispatch('connectionSend', { event: 'startFeeding' });
    },

    newFeedingInterval({ commit, dispatch }, data) {
      commit('UPDATE_FEEDING_INTERVAL', data);
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

    startTimerNextFeeding({ commit, state }) {
      const id = setInterval(() => {
        const now = DateTime.local();
        const later = DateTime.fromMillis(state.lastFeedingTime).plus({
          hours: state.feedingInterval,
        });

        if (now < later) {
          const i = Interval.fromDateTimes(now, later)
            .toDuration(['hours', 'minutes', 'seconds'])
            .toObject();

          const timeFormat = `${i.hours}:${Math.round(i.minutes)}:${Math.round(i.seconds)}`;

          commit('SET_NEXT_FEEDING_TIME', timeFormat);
        }
      }, 1000);
      commit('SET_TIMER', id);
    },

    /** */
    connectionEvent({ dispatch }, payload) {
      dispatch(`socket_${payload.event}`, payload.data);
    },

    connectionSend({ state }, payload) {
      const message = JSON.stringify(payload);
      state.socket.send(message);
    },

    connectionError({ commit, state }) {
      commit(
        'ADD_ALERT',
        { type: 'error', message: 'error.disconnect', device: state.name },
        { root: true },
      );
      // state.socket.close();
    },

    close({ commit, state }) {
      commit('DEL_TIMER');
      state.socket.close();
    },
  },

  getters: {
    lastFeedingTime(state) {
      return DateTime.fromMillis(state.lastFeedingTime).toLocaleString(DateTime.DATETIME_MED);
    },
  },

  namespaced: true,
});
