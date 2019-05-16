<template>
  <v-navigation-drawer
    app
    fixed
    @input="(e)=> toggle(e)"
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
      <v-divider class="my-3" />

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
              {{ device.title || '' }}
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

      <v-divider class="my-3" />
      <v-list-tile @click="goHelp">
        <v-list-tile-action>
          <v-icon>help</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t('help') }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider class="my-3" />

      <v-list-tile class="mt-5">
        <v-select
          box
          :label="$t('language')"
          :items="itemLanguages"
          :value="local"
          @change="updateLocal"
        />
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import Router from '@/router';

export default {
  name: 'z-header',

  computed: {
    ...mapGetters([
      'devices',
      'showMenu',
      'devicesLimit',
      'activeIndexDevice',
      'languages',
      'local',
    ]),

    itemLanguages() {
      return this.languages.map(l => {
        return {
          text: this.$t(`languages.${l}`),
          value: l,
        };
      });
    },
  },

  methods: {
    ...mapActions([
      'toggleConnectModal',
      'addAlert',
      'disconnectDevice',
      'selectDevice',
      'toggleMenu',
      'setLocal',
    ]),

    updateLocal(local) {
      // console.log(local);

      this.$i18n.locale = local;
      this.setLocal(local);
    },

    goHelp() {
      Router.replace({ name: 'help' });
    },

    toggle(open) {
      if (open !== this.showMenu) {
        this.toggleMenu();
      }
    },
  },
};
</script>


<style>
</style>
