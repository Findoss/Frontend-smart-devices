import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Router from '../router';

import { DEVICES_LIMIT } from '../utils/constants';

import createStoreModuleAW from '../devices/aw/store';
import createStoreModulePF from '../devices/pf/store';
import genId from '../utils/genId';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //
    activeIndexDevice: 0,
    devices: [],

    alerts: [],

    showMenu: true,
    showConnectModal: false,

    ip: '127.0.0.1',
    port: 3004,

    isLoadDevice: false,

    local: 'en',
    languages: ['en', 'ru'],
  },

  mutations: {
    ADD_ALERT(state, alert) {
      state.alerts.push({ ...alert, key: genId() });
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

    SET_LOAD_DEVICE(state, v) {
      state.isLoadDevice = v;
    },

    SET_LOCAL(state, local) {
      state.local = local;
    },
  },

  actions: {
    setLocal({ commit }, local) {
      commit('SET_LOCAL', local);
    },

    addAlert({ commit }, alert) {
      commit('ADD_ALERT', alert);
    },

    toggleConnectModal({ commit }) {
      commit('TOGGLE_CONNECT_MODAL');
    },

    setIP({ commit }, payload) {
      commit('SET_IP', payload);
    },

    setPort({ commit }, payload) {
      commit('SET_PORT', payload);
    },

    toggleMenu({ commit }) {
      commit('TOGGLE_MENU');
    },

    connectDevice({
 commit, getters, state, dispatch 
}) {
      const url = `ws://${state.ip}:${state.port}`;

      commit('SET_LOAD_DEVICE', true);

      const id = genId();
      const socket = new WebSocket(url);

      socket.onmessage = (data) => {
        const message = JSON.parse(data.data);
        if (message.event === 'init') {
          //
          const { type, microcontroller } = message.data;
          const initData = { socket, ...message.data };

          dispatch('createDeviceModule', { type, id, initData });

          commit('ADD_DEVICE', {
            id,
            url,
            title: microcontroller,
            type,
          });
          commit('TOGGLE_CONNECT_MODAL');
          commit('SET_LOAD_DEVICE', false);

          commit('SET_DEVICE', id);
          Router.replace({ name: type, params: { id } });

          if (getters.devicesLimit) {
            commit('ADD_ALERT', { type: 'warning', message: 'error.devicesLimit' });
          }
        } else {
          dispatch(`${id}/connectionEvent`, message);
        }
      };

      socket.onerror = () => {
        commit('ADD_ALERT', {
          type: 'error',
          message: 'error.connect',
        });
        commit('SET_LOAD_DEVICE', false);
      };

      socket.onclose = () => {
        commit('ADD_ALERT', {
          type: 'warning',
          message: 'error.close',
        });
        commit('SET_LOAD_DEVICE', false);
      };
    },

    createDeviceModule({}, { type, id, initData }) {
      let storeModule = {};
      if (type === 'aw') storeModule = createStoreModuleAW(initData);
      else if (type === 'pf') storeModule = createStoreModulePF(initData);
      // else if (type === 'pf') storeModule = createStoreModulePF(socket);
      this.registerModule(id, storeModule);
    },

    reconnectDevices({ state, commit, dispatch }) {
      if (state.devices.length) {
        state.devices.forEach((device) => {
          const socket = new WebSocket(device.url);

          socket.onmessage = (data) => {
            const message = JSON.parse(data.data);
            if (message.event === 'init') {
              const initData = { socket, ...message.data };

              dispatch('createDeviceModule', {
                id: device.id,
                type: device.type,
                initData,
              });

              Router.replace({ name: device.type, params: { id: state.activeIndexDevice } });
            } else {
              dispatch(`${device.id}/connectionEvent`, message);
            }
          };

          socket.onerror = () => {
            commit('ADD_ALERT', {
              type: 'error',
              message: 'error.connect',
              device: device.name,
            });
            commit('SET_LOAD_DEVICE', false);
          };

          socket.onclose = () => {
            commit('ADD_ALERT', {
              type: 'warning',
              message: 'error.close',
              device: device.name,
            });
            commit('SET_LOAD_DEVICE', false);
            dispatch('disconnectDevice', device.id);
          };
        });
      }
    },

    disconnectDevice({ state, commit, dispatch }, id) {
      if (state.devices.length === 1) {
        commit('TOGGLE_CONNECT_MODAL');
        Router.replace({ name: 'root' });
      } else {
        dispatch('selectDevice', state.devices[0].id);
      }

      commit('DEL_DEVICE', id);
      dispatch(`${id}/close`).finally(() => {
        this.unregisterModule(id);
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
      return ' ';
    },
    devices: (state) => {
      const devices = state.devices.map((device) => {
        let icon = '';
        switch (device.type) {
          case 'aw':
            icon = 'local_florist';
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
    ip: state => state.ip,
    port: state => state.port,
    local: state => state.local,
    alerts: state => state.alerts,
    showMenu: state => state.showMenu,
    languages: state => state.languages,
    isLoadDevice: state => state.isLoadDevice,
    showConnectModal: state => state.showConnectModal,
    activeIndexDevice: state => state.activeIndexDevice,
    devicesLimit: state => state.devices.length === DEVICES_LIMIT,
    deviceById: state => id => state.devices.find(device => device.id === id),
  },

  modules: {},

  plugins: [
    createPersistedState({
      key: 'SD-1',
      paths: ['ip', 'port', 'local', 'activeIndexDevice', 'showMenu'],
    }),
  ],

  namespaced: true,
});
