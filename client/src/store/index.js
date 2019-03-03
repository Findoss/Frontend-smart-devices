import Vue from 'vue';
import Vuex from 'vuex';
import Router from '@/router';

import createPersistedState from 'vuex-persistedstate';
import { DEVICES_LIMIT } from '../utils/constants';

import createStoreModuleAW from '../devices/aw/store';
import createStoreModulePF from '../devices/pf/store';
import genId from '../utils/genId';

// import RegisterStoreModule from '@/mixins/RegisterStoreModule';
// import automaticWateringModule from '@/devices/aw/store';
// import petFeederModule from '@/devices/pf/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //
    activeIndexDevice: 0,
    devices: [],

    errors: [],

    showMenu: false,
    showConnectModal: false,

    ip: '127.0.0.1',
    port: 3004,

    isLoadDevice: false,

    languages: ['en', 'ru'],
  },

  mutations: {
    ADD_ALERT(state, alert) {
      state.errors.push({ ...alert, key: genId() });
    },
    ADD_DEVICE(state, payload) {
      state.devices.push(payload);
    },
    DEL_DEVICE(state, id) {
      state.devices.splice(state.devices.findIndex(d => d.id === id), 1);
    },
    SET_DEVICE(state, id) {
      state.activeIndexDevice = id;
    },
    SET_IP(state, ip) {
      state.ip = ip;
    },
    SET_PORT(state, port) {
      state.port = port;
    },
    TOGGLE_CONNECT_MODAL(state) {
      state.showConnectModal = !state.showConnectModal;
    },
    TOGGLE_MENU(state) {
      state.showMenu = !state.showMenu;
    },
    TOGGLE_LOAD_DEVICE(state) {
      state.isLoadDevice = !state.isLoadDevice;
    },
  },

  actions: {
    addAlert({ commit }, alert) {
      commit('ADD_ALERT', alert);
    },

    toggleConnectModal({ commit }) {
      commit('TOGGLE_CONNECT_MODAL');
    },

    // setURL({ dispatch }, payload) {
    //   dispatch('setIP', payload.ip);
    //   dispatch('setPort', payload.port);
    // },

    setIP({ commit }, payload) {
      commit('SET_IP', payload);
    },

    setPort({ commit }, payload) {
      commit('SET_PORT', payload);
    },

    toggleMenu({ commit }) {
      commit('TOGGLE_MENU');
    },

    connectDevice({ commit, getters, state }, password) {
      const url = `ws://${state.ip}:${state.port}`;

      commit('TOGGLE_LOAD_DEVICE');

      const socket = new WebSocket(url);

      socket.onmessage = (data) => {
        const message = JSON.parse(data.data);
        if (message.event === 'init') {
          //
          const id = genId();
          const { type, microcontroller } = message.data;
          const initData = { socket, ...message.data };
          let storeModule = {};

          if (type === 'aw') storeModule = createStoreModuleAW(initData);
          else if (type === 'pf') storeModule = createStoreModulePF(initData);
          // else if (type === 'pf') storeModule = createStoreModulePF(socket);

          this.registerModule(id, storeModule);

          commit('ADD_DEVICE', {
            id,
            url,
            title: microcontroller,
            type,
          });
          commit('TOGGLE_CONNECT_MODAL');
          commit('TOGGLE_LOAD_DEVICE');

          commit('SET_DEVICE', id);
          Router.replace({ name: type, params: { id } });

          if (getters.devicesLimit) {
            commit('ADD_ALERT', { type: 'warning', message: 'error.devicesLimit' });
          }
        }
      };

      socket.onerror = () => {
        commit('ADD_ALERT', { type: 'warning', message: 'error.connect' });
        commit('TOGGLE_LOAD_DEVICE');
        socket.close();
      };
    },

    reconnectDevice({ commit, getters }) {},

    disconnectDevice({ commit, getters, dispatch }, id) {
      if (getters.devices.length === 1) {
        commit('TOGGLE_CONNECT_MODAL');
        Router.replace({ name: 'root' });
      } else {
        dispatch('selectDevice', getters.devices[0].id);
      }

      dispatch(`${id}/close`).then(() => {
        this.unregisterModule(id);
        commit('DEL_DEVICE', id);
      });
    },

    selectDevice({ commit, getters }, id) {
      commit('SET_DEVICE', id);
      Router.replace({ name: getters.deviceById(id).type, params: { id } });
    },
  },

  getters: {
    activeDevice: (state, getters) => {
      if (state.devices.length) {
        return getters.deviceById(getters.activeIndexDevice).title;
      }
    },
    errors: state => state.errors,
    devices: (state) => {
      const devices = state.devices.map((device) => {
        let icon = '';
        switch (device.type) {
          case 'aw':
            icon = 'spa';
            break;
          case 'pf':
            icon = 'pets';
            break;
          default:
            icon = 'developer_board';
            break;
        }
        device.icon = icon;
        return device;
      });
      return devices;
    },
    activeIndexDevice: state => state.activeIndexDevice,
    deviceById: state => id => state.devices.find(device => device.id === id),
    devicesLimit: state => state.devices.length === DEVICES_LIMIT,
    isLoadDevice: state => state.isLoadDevice,
    showMenu: state => state.showMenu,
    showConnectModal: state => state.showConnectModal,
    ip: state => state.ip,
    port: state => state.port,
    language: state => state.language,
    languages: state => state.languages,
  },

  modules: {},

  plugins: [
    createPersistedState({
      key: 'SD-1',
      paths: ['ip', 'port'],
    }),
  ],

  namespaced: true,
});
