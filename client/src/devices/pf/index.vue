<template>
  <v-container
    grid-list-md
    wrap
  >
    <v-layout wrap>

      <v-flex
        d-flex
        md6
        sm12
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.actions') }}
            </h3>
          </v-card-title>
          <v-container
            align-center
            justify-center
          >
            <v-btn
              large
              color="primary"
              class="s mb-4"
              @click="startFeeding"
            >
              {{ $t('pf.startFeeding') }}
            </v-btn>
            <v-btn
              large
              color="primary"
              class="s mb-4"
              @click="feedUpdated"
            >
              {{ $t('pf.feedUpdated') }}
            </v-btn>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex
        d-flex
        md3
        sm6
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.countPortion') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <v-btn
              fab
              small
              color="primary"
              class="elevation-0 s"
              @click="decrementCountPortion"
            >
              <v-icon>remove</v-icon>
            </v-btn>
            <span class="xxl-text ma-0">
              {{ stateLocal.countPortion }}
            </span>
            <v-btn
              fab
              small
              color="primary"
              class="elevation-0 s"
              @click="incrementCountPortion"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        d-flex
        md3
        sm6
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.portionsLeft') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <span class="xxl-text">
              {{ stateLocal.maxFeedingCount - stateLocal.feedingCount }}
            </span>
            {{ $t('pf.outOf') }}
            <span class="xxl-text">
              {{ stateLocal.maxFeedingCount }}
            </span>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        d-flex
        md3
        sm12
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.left') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <span class="xxl-text">
              {{ stateLocal.nextFeedingTime ? stateLocal.nextFeedingTime : '' }}
            </span>
            <br>
            <br>
            <h3 class="headline mb-0">
              {{ $t('pf.lastFeedingTime') }}
            </h3>
            {{ lastFeedingTime }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        d-flex
        md9
        sm12
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.feedingInterval') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <span class="xxl-text feeding-interval">
              {{ stateLocal.feedingInterval }} {{ $t('pf.hours') }}
            </span>
            <v-slider
              step="1"
              min="0"
              max="12"
              ticks="always"
              thumb-label
              tick-size="3"
              class="mx-1"
              @change="newFeedingInterval"
              :value="stateLocal.feedingInterval"
            />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        d-flex
        md12
        sm12
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ $t('pf.feedingMode') }}
            </h3>
          </v-card-title>
          <v-layout
            wrap
            align-center
            justify-space-around
            row
          >
            <v-flex
              v-for="i in 3"
              :key="i"
              md3
              sm3
              xs12
              :class="['px-3','py-3', 'mb-4', 'elevation-2',
              'item_mode'
              , stateLocal.mode === i ? 'item_mode-active':'']"
              @click="setMode(i)"
            >
              <span class="text-bg text-uppercase">
                {{ $t(`pf.mode.${i-1}`) }}
              </span>
              <img :src="`img/${i}.png`">
            </v-flex>
          </v-layout>

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
    incrementCountPortion: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/countPortion`, 'inc');
    },
    decrementCountPortion: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/countPortion`, 'dec');
    },
    startFeeding: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/startFeeding`);
    },
    feedUpdated: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/feedUpdated`);
    },
    setMode: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/setMode`, payload);
    },
  },

  mounted() {
    setTimeout(() => {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/startTimerNextFeeding`);
    }, 1000);
  },
};
</script>

<style>
.xxl-text {
  font-size: 2.25rem;
}

.s {
  border-radius: 0 !important;
  margin-top: -10px !important;
}

.item_mode {
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 130px;
}

.item_mode img {
  display: block;
}

.item_mode:hover {
  background-color: #bbdefb;
}

.item_mode-active {
  background-color: #81c784;
}

.feeding-interval {
  display: block;
  text-align: center;
}

.text-bg {
  font-size: 35px;
  display: inline;
  position: absolute;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.15);
  top: 0;
  right: 5%;
}

.item_mode-active .text-bg::after {
  content: '✔';
}
</style>
