import { DateTime, Interval } from 'luxon';

const COEFFICIENT_MODE = [2, 3, 1];

export default initData => ({
  state() {
    return {
      socket: initData.socket,

      nextFeedingTime: '',
      idTimerNextFeeding: null,

      name: initData.microcontroller,
      feedingCount: initData.feedingCount,
      limitFeedingCount: initData.maxFeedingCount,
      maxFeedingCount: initData.maxFeedingCount * COEFFICIENT_MODE[initData.mode - 1],
      countPortion: initData.countPortion,
      lastFeedingTime: initData.lastFeedingTime,
      feedingInterval: initData.feedingInterval,
      mode: initData.mode,
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

    INC_FEEDING_COUNT(state, number = 1) {
      state.feedingCount += number;
    },

    RESET_FEED(state) {
      state.feedingCount = 0;
    },

    RESET_LAST_FEEDING_TIME(state) {
      state.lastFeedingTime = Date.now();
    },

    UPDATE_FEEDING_INTERVAL(state, number = 5) {
      state.feedingInterval = number;
    },

    SET_COUNT_PORTION(state, number = 1) {
      state.countPortion = number;
    },

    SET_MODE(state, number) {
      state.mode = number;
      state.maxFeedingCount = state.limitFeedingCount * COEFFICIENT_MODE[number - 1];
    },
  },

  actions: {
    socket_feeding({ commit, state }) {
      const portionsFeedLeft = state.maxFeedingCount - state.feedingCount;

      if (portionsFeedLeft < state.countPortion) {
        if (portionsFeedLeft <= 0) {
          // невозможно
          commit(
            'ADD_ALERT',
            { type: 'warning', message: 'pf.soonNoFeed', device: state.name },
            { root: true },
          );
        } else {
          // возможно c условием
          commit(
            'ADD_ALERT',
            { type: 'info', message: 'pf.reducePortion', device: state.name },
            { root: true },
          );
        }
      } else {
        // возможно
        commit('INC_FEEDING_COUNT', state.countPortion);
        commit('RESET_LAST_FEEDING_TIME');
        commit(
          'ADD_ALERT',
          { type: 'success', message: 'pf.feeding', device: state.name },
          { root: true },
        );
        if (portionsFeedLeft > state.countPortion && portionsFeedLeft < state.countPortion * 2) {
          // предупреждение
          commit(
            'ADD_ALERT',
            { type: 'info', message: 'pf.enoughServing', device: state.name },
            { root: true },
          );
        }
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

    countPortion({ commit, dispatch, state }, { count, type }) {
      if (count > 0) {
        const countFidingLeft = state.maxFeedingCount - state.feedingCount;

        if (count <= countFidingLeft) {
          dispatch('connectionSend', { event: 'countPortion', count });
          commit('SET_COUNT_PORTION', count);
        } else if (count > state.maxFeedingCount && type === 'dec') {
          commit('SET_COUNT_PORTION', countFidingLeft);
        } else if (count > state.maxFeedingCount && type === 'inc') {
          commit(
            'ADD_ALERT',
            { type: 'info', message: 'pf.limitContainer', device: state.name },
            { root: true },
          );
        } else if (count > countFidingLeft && type === 'inc') {
          commit(
            'ADD_ALERT',
            { type: 'info', message: 'pf.noIncreasePortion', device: state.name },
            { root: true },
          );
        }
      }
    },

    setMode({ commit, dispatch }, data) {
      dispatch('connectionSend', { event: 'mode', data });
      commit('SET_MODE', data);
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

    connectionError({ commit, state, dispatch }) {
      commit(
        'ADD_ALERT',
        { type: 'error', message: 'error.disconnect', device: state.name },
        { root: true },
      );
      state.socket.close();
    },

    close({ commit, state }) {
      commit('DEL_TIMER');
      state.socket.close();
    },
  },

  getters: {
    lastFeedingTime(state, getters, rootState) {
      return DateTime.fromMillis(state.lastFeedingTime)
        .setLocale(rootState.local)
        .toLocaleString(DateTime.DATETIME_MED);
    },
  },

  namespaced: true,
});
