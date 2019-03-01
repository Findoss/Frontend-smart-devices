<template>
  <v-toolbar
    app
    flat
    dark
    fixed
    color="blue darken-4"
    :clipped-left="$vuetify.breakpoint.lgAndUp"
  >
    <v-toolbar-side-icon @click.stop="toggleMenu()" />

    <v-toolbar-title>
      {{ $t('smart').toUpperCase() }}
      {{ $t('devices').toUpperCase() }}
      -
      {{ activeDevice }}
    </v-toolbar-title>
  </v-toolbar>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'z-header',

  computed: {
    ...mapGetters(['activeDevice']),
  },

  methods: {
    ...mapActions(['toggleMenu']),
  },
};
</script>


<style>
</style>
