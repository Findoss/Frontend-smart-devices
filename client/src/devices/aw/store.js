export default initData => ({
  state() {
    return {
      microcontroller: initData.microcontroller,
      dateWatering: initData.dateWatering,
      autotesting: initData.autotesting,
      wateringMode: initData.wateringMode,
      sensorAnalysis: initData.sensorAnalysis,
      automaticWatering: initData.automaticWatering,
      humidity: initData.humidity,
      socket: initData.socket,
    };
  },

  mutations: {
    ADD_ALERT(state, alert) {
      //
    },
  },

  actions: {
    aaa({ commit, state, getters }, form) {
      console.log('yeah');
    },
  },

  getters: {},

  namespaced: true,
});
