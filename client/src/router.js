import Vue from 'vue';
import Router from 'vue-router';
import Notes from './views/notes.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'notes',
      component: Notes,
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('./views/settings.vue'),
    },
    {
      path: '/automatic-watering',
      name: 'automatic-watering',
      component: () => import('./devices/automatic-watering/index.vue'),
    },
    {
      path: '/pet-feeder',
      name: 'pet-feeder',
      component: () => import('./devices/pet-feeder/index.vue'),
    },
  ],
});
