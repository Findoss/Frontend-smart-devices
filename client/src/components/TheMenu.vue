<template>
  <v-navigation-drawer
    app
    fixed
    :value="showMenu"
    :clipped="$vuetify.breakpoint.lgAndUp"
  >
    <v-list>

      <v-list-tile
        @click="toggleConnectModal()"
        :disabled="devicesLimit"
      >
        <v-list-tile-action>
          <v-icon
            large
            color="green darken-1"
          >
            add_circle
          </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t('createNewConnection') }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider class="my-3"></v-divider>

      <template v-for="(device) in devices">

        <v-list-tile
          :key="device.id"
          :class="[device.id === activeIndexDevice ? 'blue lighten-4': '']"
          @click="selectDevice(device.id)"
        >
          <v-list-tile-action>
            <v-icon>{{ device.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ device.title }}
            </v-list-tile-title>
          </v-list-tile-content>
          <v-btn
            flat
            icon
            small
            color="pink"
            @click.stop="disconnectDevice(device.id)"
          >
            <v-icon>
              close
            </v-icon>
          </v-btn>
        </v-list-tile>

      </template>

      <v-divider class="my-3"></v-divider>
      <v-list-tile @click="">
        <v-list-tile-action>
          <v-icon>help</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t('help') }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile :disabled="true">
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t('settings') }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'z-header',

  computed: {
    ...mapGetters(['devices', 'showMenu', 'devicesLimit', 'activeIndexDevice']),
  },

  methods: {
    ...mapActions(['toggleConnectModal', 'addAlert', 'disconnectDevice', 'selectDevice']),
  },
};
</script>


<style>
.active-device {
  background-color: black;
}
</style>
