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
            <h3 class="headline mb-0">{{ $t('pf.left') }}</h3>
          </v-card-title>
          <v-card-text>
            <span class="xxl-text">
              {{ displayNextFeedingTime }}
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
            <h3 class="headline mb-0">{{ $t('pf.portionsFeedLeft') }}</h3>
          </v-card-title>
          <v-card-text class="xxl-text">
            {{ data.maxFeedingCount - data.feedingCount }}
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
            <h3 class="headline mb-0">{{ $t('pf.startFeeding') }}</h3>
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
            <h3 class="headline mb-0">{{ $t('pf.feedUpdated') }}</h3>
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
            <h3 class="headline mb-0">{{ $t('pf.doublePortion') }}</h3>
          </v-card-title>
          <v-card-text>
            <v-switch
              :value="data.doublePortion"
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
            :value="`${data.feedingInterval}:00`"
            :allowed-minutes="v => 0"
          />
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex';
import { DateTime, Interval } from 'luxon';

export default {
  computed: {
    id() {
      return this.$store.getters['activeIndexDevice'];
    },

    lastFeedingTime() {
      return DateTime.fromMillis(this.data.lastFeedingTime).toLocaleString(DateTime.DATETIME_MED);
    },

    data() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },
  },

  data: () => {
    return {
      timePicker: 1,
      displayNextFeedingTime: '',
    };
  },

  methods: {
    event: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/event`, payload);
    },
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

    nextFeedingTime: function() {
      return () => {
        setInterval(() => {
          const now = DateTime.local();
          const later = DateTime.fromMillis(this.data.lastFeedingTime).plus({
            hours: this.data.feedingInterval,
          });

          console.log(this.data.feedingInterval);

          const i = Interval.fromDateTimes(now, later)
            .toDuration(['hours', 'minutes', 'seconds'])
            .toObject();

          this.displayNextFeedingTime = `${i.hours}:${Math.round(i.minutes)}:${Math.round(
            i.seconds
          )}`;
        }, 1000);
      };
    },
  },

  created() {
    const { socket } = this.data;

    this.nextFeedingTime()();

    socket.onmessage = data => {
      const payload = JSON.parse(data.data);
      this.event(payload);
    };

    socket.onerror = () => {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/connectionError`);
      // socket.close();
    };

    socket.onclose = () => {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/connectionError`);
      // socket.close();
    };
  },
};
</script>

<style>
.xxl-text {
  font-size: 3.5rem;
}
</style>
