import Vue from 'vue';
import Router from 'vue-router';
import store from './store/index';

import Help from './views/help.vue';

import viewAW from './devices/aw/index.vue';
import viewPF from './devices/pf/index.vue';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root',
    },
    {
      path: '/help',
      name: 'help',
      meta: { isNotEmpty: true },
      component: Help,
    },
    {
      path: '/automatic-watering/:id',
      name: 'aw',
      meta: { isNotEmpty: true },
      component: viewAW,
    },
    {
      path: '/pet-feeder/:id',
      name: 'pf',
      meta: { isNotEmpty: true },
      component: viewPF,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isNotEmpty = to.matched.some(r => r.meta.isNotEmpty);

  const { getters, state } = store;
  const { devices } = getters;
  const isDevices = !!devices.length;
  const isModuleDevice = !!state[from.params.id];

  if ((isNotEmpty && !isDevices) || (isNotEmpty && !isModuleDevice)) {
    next({ name: 'root' });
  }

  next();
});

export default router;
