<template>
  <v-app>
    <!--  -->
    <div class="global-top">
      <v-alert
        v-for="(error) of errors"
        :value="error.message"
        :dismissible="true"
        :type="error.type"
        :key="error.key"
        class="global-top"
      >
        {{error.message}}
      </v-alert>
    </div>

    <!--  -->
    <v-toolbar
      app
      fixed
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-4"
      dark
      flat
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $t(activeDevice) }}</v-toolbar-title>
    </v-toolbar>

    <!--  -->
    <v-navigation-drawer
      app
      fixed
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
    >
      <v-list>

        <v-list-tile @click="connect = !connect">
          <v-list-tile-action>
            <v-icon>add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{ $t('createNewConnection') }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-3"></v-divider>

        <template v-for="(item, i) in menu">
          <v-divider
            v-if="item.divider"
            class="my-3"
            :key="i"
          ></v-divider>
          <v-list-tile
            v-else
            :key="i"
            @click=""
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ $t(item.text) }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!--  -->
    <v-dialog
      v-model="connect"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Use Google's location service?</v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat
            @click="connect = false"
          >Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="connect = false"
          >Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  -->
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',

  data: () => {
    return {
      drawer: null,
      connect: null,
    };
  },

  computed: {
    ...mapGetters(['errors', 'menu', 'activeDevice']),
  },
};
</script>

<style>
.global-top {
  position: absolute;
  z-index: 999;
  width: 30vw;
  right: 0;
}
</style>
