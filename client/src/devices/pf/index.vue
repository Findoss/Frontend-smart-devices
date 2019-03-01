<template>
  <v-container grid-list-md>
    <v-layout wrap>

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
            <h3 class="headline mb-0">{{ $t('pf.lastFeedingTime') }}</h3>
          </v-card-title>

          <v-card-text>
            {{ new Date(data.lastFeedingTime).toUTCString() }}
            <br>
            interval
            <br>

            {{ $t('pf.left') }} TODO TIMER
            <br>
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
            <h3 class="headline mb-0">{{ $t('pf.feedingCount') }}</h3>
          </v-card-title>
          <v-card-text>
            {{ data.feedingCount }} / {{ data.maxFeedingCount }}
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
            :allowed-minutes="v => v % 10 === 0"
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

    data() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },
  },

  data: () => {
    return {
      timePicker: '',
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
  },

  created() {
    const { socket } = this.data;

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