<template>
  <v-container
    grid-list-md
    wrap
  >
    <v-layout wrap>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.left') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <span class="xxl-text">
              {{ stateLocal.nextFeedingTime }}
            </span>
            <br>
            {{ $t('pf.lastFeedingTime') }} {{ lastFeedingTime }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.portionsFeedLeft') }}
            </h3>
          </v-card-title>
          <v-card-text class="xxl-text">
            {{ stateLocal.maxFeedingCount - stateLocal.feedingCount }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.startFeeding') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <v-btn @click="startFeeding">
              {{ $t('pf.startFeeding') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.feedUpdated') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <v-btn @click="feedUpdated">
              {{ $t('pf.feedUpdated') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.doublePortion') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <v-switch
              :value="stateLocal.doublePortion"
              :label="$t('pf.x2Portion')"
              @change="doublePortion"
              color="success"
            />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
        md4
      >
        <v-card>
          <v-time-picker
            min="1:00"
            max="11:59"
            width="350"
            @input="newFeedingInterval"
            :value="`${stateLocal.feedingInterval}:00`"
            :allowed-minutes="v => 0"
          />
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    id() {
      return this.$store.getters['activeIndexDevice'];
    },

    lastFeedingTime() {
      return this.$store.getters[`${this.$store.getters['activeIndexDevice']}/lastFeedingTime`];
    },

    stateLocal() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },
  },

  methods: {
    newFeedingInterval: function(payload) {
      this.$store.dispatch(
        `${this.$store.getters['activeIndexDevice']}/newFeedingInterval`,
        payload
      );
    },
    doublePortion: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/doublePortion`, payload);
    },
    startFeeding: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/startFeeding`);
    },
    feedUpdated: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/feedUpdated`);
    },
    startTimerNextFeeding: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/startTimerNextFeeding`);
    },
  },

  created() {
    const { socket } = this.stateLocal;

    this.startTimerNextFeeding();

    socket.onmessage = data => {
      const payload = JSON.parse(data.data);
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/connectionEvent`, payload);
    };

    socket.onerror = () => {
      if (this.$store.getters['activeIndexDevice']) {
        this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/connectionError`);
      }
    };
  },
};
</script>

<style>
.xxl-text {
  font-size: 3.5rem;
}
</style>
