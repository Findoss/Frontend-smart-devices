<template>
  <v-app>

    <z-global-alerts />

    <z-header />

    <z-menu />

    <z-connection-modal />

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Alerts from '@/components/TheAlerts.vue';
import Header from '@/components/TheHeader.vue';
import Menu from '@/components/TheMenu.vue';
import ConnectionModal from '@/components/TheConnectionModal.vue';

export default {
  name: 'App',

  components: {
    'z-connection-modal': ConnectionModal,
    'z-global-alerts': Alerts,
    'z-header': Header,
    'z-menu': Menu,
  },
  computed: {
    ...mapGetters(['local']),
  },

  methods: {
    restoreLocal() {
      this.$i18n.locale = this.local;
    },
  },

  created() {
    this.restoreLocal();
  },
};
</script>
