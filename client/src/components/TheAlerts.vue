<template>
  <v-layout class="global-top">
    <v-flex
      justify-end
      xs6
      sm6
      md4
    >
      <v-alert
        v-for="(error) of errors"
        :value="error.message"
        :dismissible="true"
        :type="error.type"
        :key="error.key"
        class="pointer-events"
      >
        {{ $t(error.message) }}
      </v-alert>
    </v-flex>
  </v-layout>

</template>


<script>
import { mapGetters } from 'vuex';

export default {
  name: 'z-global-alerts',

  computed: {
    ...mapGetters(['errors']),
  },
};
</script>


<style>
.global-top {
  position: absolute;
  z-index: 999;
  width: 100%;
  justify-content: flex-end;
  pointer-events: none;
}

.pointer-events {
  pointer-events: all;
}
</style>
