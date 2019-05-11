import { DateTime, Interval } from 'luxon';
import { log } from 'util';

export default initData => ({
  state() {
    return {
      name: initData.microcontroller,
      dateWatering: initData.dateWatering,
      autotesting: initData.autotesting,
      wateringMode: initData.wateringMode,
      sensorAnalysis: initData.sensorAnalysis,
      automaticWatering: initData.automaticWatering,
      humidity: initData.humidity,
      dataHumidity: initData.dataHumidity,

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

    ADD_DATA_HUMIDITY(state, number) {
      state.dataHumidity.push(number);
    },

    SET_HUMIDITY(state, number) {
      state.humidity = number;
    },

    TOGGLE_AUTOTESTING(state) {
      state.autotesting = !state.autotesting;
    },

    TOGGLE_SENSORANALYSIS(state) {
      state.sensorAnalysis = !state.sensorAnalysis;
    },

    TOGGLE_AUTOMATICWATERING(state) {
      state.automaticWatering = !state.automaticWatering;
    },

    TOGGLE_MODE(state) {
      state.wateringMode = !state.wateringMode;
    },
  },

  actions: {
    startTimerNextFeeding({ commit, state }) {
      const id = setInterval(() => {
        const now = DateTime.local();
        const wateringStart = DateTime.fromMillis(state.dateWatering);
        const wateringInterval = state.wateringMode ? 3600000 : 86400000;
        const wateringI = Date.now() - new Date(state.dateWatering);
        const wateringCount = Math.floor(wateringI / wateringInterval);
        const wateringLast = wateringStart.plus({
          millisecond: wateringCount * wateringInterval,
        });
        const later = wateringLast.plus({
          millisecond: wateringInterval,
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

    restart({ dispatch }) {
      dispatch('connectionSend', { event: 'restart' });
    },

    setHumidity({ dispatch, commit }, data) {
      dispatch('connectionSend', { event: 'setHumidity', data });
      commit('SET_HUMIDITY', data);
    },

    toggleMode({ dispatch, commit, state }, data) {
      commit('TOGGLE_MODE');
      dispatch('connectionSend', { event: 'setWateringMode', data: state.wateringMode });
    },

    systemCheck({ dispatch }) {
      dispatch('connectionSend', { event: 'systemCheck' });
    },

    toggleAutotesting({ dispatch, commit, state }) {
      commit('TOGGLE_AUTOTESTING');
      dispatch('connectionSend', { event: 'setAutotesting', data: state.autotesting });
    },

    toggleSensorAnalysis({ dispatch, commit, state }) {
      commit('TOGGLE_SENSORANALYSIS');
      dispatch('connectionSend', { event: 'setSensorAnalysis', data: state.sensorAnalysis });
    },

    toggleAutomaticWatering({ dispatch, commit, state }) {
      commit('TOGGLE_AUTOMATICWATERING');
      dispatch('connectionSend', { event: 'setAutomaticWatering', data: state.automaticWatering });
    },

    /** * */
    socket_newHumidity({ commit }, data) {
      commit('ADD_DATA_HUMIDITY', data);
    },

    socket_restart() {},
    socket_systemCheck() {},
    socket_setHumidity() {},
    socket_setAutotesting() {},
    socket_setSensorAnalysis() {},
    socket_setAutomaticWatering() {},
    socket_setWateringMode() {},

    /** * */
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
      state.socket.close();
    },
  },

  getters: {},

  namespaced: true,
});
