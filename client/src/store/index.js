import Vue from 'vue';
import Vuex from 'vuex';

import { createSocketioPlugin } from 'vuex-socketio-plugin';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeDevice: 'fake-device',
    devices: [
      { icon: 'developer_board', text: 'fake-device' },
      { icon: 'developer_board', text: 'fake-device' },
      { icon: 'developer_board', text: 'fake-device' },
      { icon: 'developer_board', text: 'fake-device' },
      { icon: 'developer_board', text: 'fake-device' },
      { icon: 'developer_board', text: 'fake-device' },
    ],
    errors: [
      { type: 'success', message: 'test 0', key: '0' },
      { type: 'error', message: 'test 1', key: '1' },
      { type: 'warning', message: 'test 2', key: '2' },
      { type: 'info', message: 'test 3', key: '3' },
    ],

    menuBottomItems: [
      { divider: true },
      { icon: 'lightbulb_outline', text: 'notes' },
      { icon: 'settings', text: 'settings' },
    ],
  },
  mutations: {},
  actions: {},
  getters: {
    activeDevice: state => state.activeDevice,
    errors: state => state.errors,
    menu: state => state.devices.concat(state.menuBottomItems),
  },
  plugins: [
    // createSocketioPlugin(socket, {
    //   actionPrefix: 'socket',
    // }),
    createPersistedState({
      key: 'SD-1',
    }),
  ],
});
