<template>
  <div>
    <v-container
      grid-list-md
      wrap
    >
      <v-layout wrap>

        <v-flex
          xs12
          sm12
          md12
          class="mb-2"
        >
          <v-card>
            <v-layout
              wrap
              class="px-3 py-3"
            >

              <v-flex
                xs12
                sm4
                md4
              >

                <h3 class="headline mb-0">
                  {{ $t('000') }}
                </h3>

                <span class="xxl-text">
                  {{ "time" }}
                </span>

              </v-flex>

              <v-flex
                xs12
                sm4
                md4
              >

                <h3 class="headline mb-0">
                  {{ $t('000') }}
                </h3>

                <v-btn @click="">
                  {{ $t('000') }}
                </v-btn>
                <v-btn @click="">
                  {{ $t('000') }}
                </v-btn>
                </v-card-text>

              </v-flex>

              <v-flex
                xs12
                sm4
                md4
              >

                <h3 class="headline mb-0">
                  {{ $t('000') }}
                </h3>

                <v-select
                  box
                  :label="$t('000')"
                />

              </v-flex>

            </v-layout>
          </v-card>
        </v-flex>

        <v-flex
          xs12
          sm12
          md12
          class="mb-2"
        >
          <v-card>
            <v-layout
              wrap
              class="px-3 py-3"
              justify-space-between
            >
              <v-flex
                xs12
                sm10
                md9
              >

                <h3 class="headline mb-0">
                  {{ $t('000') }}
                </h3>

                <v-slider
                  step="5"
                  min="5"
                  max="90"
                  class="mx-4"
                  v-model="v"
                  :disabled="true"
                />
                <v-slider
                  step="5"
                  min="5"
                  max="90"
                  ticks="always"
                  :tick-labels="tickLabels()"
                  tick-size="2"
                  class="mx-4"
                  v-model="v"
                />

              </v-flex>

              <v-flex
                xs12
                sm3
                md2
              >

                <h3 class="headline mb-0">
                  {{ $t('000') }}
                </h3>

                <v-switch :label="$t('000')" />
                <v-switch :label="$t('000')" />
                <v-switch :label="$t('000')" />

              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>

        <v-flex
          xs12
          sm12
          md12
        >
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">
                {{ $t('000') }}
              </h3>
            </v-card-title>
            <v-card-text>
              <highcharts :options="chartOptions" />
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>

    <div>
      automaticWatering {{ stateLocal.automaticWatering }}
      <br>
      autotesting {{ stateLocal.autotesting }}
      <br>
      dateWatering {{ stateLocal.dateWatering }}
      <br>
      humidity {{ stateLocal.humidity }}
      <br>
      microcontroller {{ stateLocal.microcontroller }}
      <br>
      sensorAnalysis {{ stateLocal.sensorAnalysis }}
      <br>
    </div>
  </div>
</template>


<script>
import { Chart } from 'highcharts-vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    highcharts: Chart,
  },

  data() {
    return {
      v: 5,
      chartOptions: {
        series: [
          {
            data: [1, 2, 3], // sample data
          },
        ],
      },
    };
  },

  computed: {
    id() {
      console.log(this.$store);
      return this.$store.getters['activeIndexDevice'];
    },

    stateLocal() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },
  },

  methods: {
    tickLabels() {
      let labels = [];
      for (let i = 5; i < 91; i += 5) {
        labels.push(i);
      }
      return labels;
    },
  },

  created() {},
};
</script>


<style>
.xxl-text {
  font-size: 2.25rem;
}
</style>
