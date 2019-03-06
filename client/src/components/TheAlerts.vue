<template>
  <v-layout class="global-top">
    <v-flex
      justify-end
      xs6
      sm6
      md4
    >
      <v-alert
        v-for="(alert) of alerts"
        :value="alert.message"
        :dismissible="true"
        :type="alert.type"
        :key="alert.key"
        class="pointer-events"
      >
        {{ alert.device }} {{ $t(alert.message) }}
      </v-alert>
    </v-flex>
  </v-layout>

</template>


<script>
import { mapGetters } from 'vuex';

export default {
  name: 'z-global-alerts',

  computed: {
    ...mapGetters(['alerts']),
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
