<template>
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
            class="px-3 pt-3"
          >
            <v-flex
              xs12
              sm3
              md3
            >
              <h3 class="headline mb-0">
                {{ $t('aw.timeLeft') }}
              </h3>
              <span class="xxl-text">
                {{ stateLocal.nextFeedingTime }}
              </span>
            </v-flex>

            <v-flex
              xs12
              sm6
              md6
            >
              <h3 class="headline mb-0">
                {{ $t('aw.actions') }}
              </h3>
              <v-btn
                large
                @click="restart"
              >
                {{ $t('aw.restart') }}
              </v-btn>
              <v-btn
                large
                @click="systemCheck"
              >
                {{ $t('aw.systemCheck') }}
              </v-btn>
            </v-flex>

            <v-flex
              xs12
              sm3
              md3
            >
              <h3 class="headline mb-0">
                {{ $t('aw.mode') }}
              </h3>

              <v-select
                box
                solo
                :label="$t('aw.mode')"
                :items="$t(`aw.modeItems`)"
                @change="dialogWateringMode = !dialogWateringMode"
                :value="stateLocal.wateringMode"
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
              sm9
              md9
            >

              <h3 class="headline mb-0">
                {{ $t('aw.chart.humidity') }}
              </h3>

              <v-slider
                step="1"
                min="5"
                max="90"
                thumb-label="always"
                class="currentH mx-4 mt-5"
                :color="color"
                :value="lastHumidity"
              />
              <v-slider
                step="5"
                min="5"
                max="90"
                ticks="always"
                :tick-labels="tickLabels()"
                tick-size="2"
                class="mx-4"
                @change="setHumidity"
                :value="stateLocal.humidity"
              />

            </v-flex>

            <v-flex
              xs12
              sm3
              md3
            >

              <h3 class="headline mb-0">
                {{ $t('aw.settings') }}
              </h3>
              <v-switch
                class="pa-0 ma-0 mt-3"
                :label="$t('aw.automaticWatering')"
                :input-value="stateLocal.automaticWatering"
                @change="toggleDialogAutomaticWatering"
              />
              <v-switch
                class="pa-0 ma-0"
                :label="$t('aw.sensorAnalysis')"
                :input-value="stateLocal.sensorAnalysis"
                @change="toggleSensorAnalysis"
              />
              <v-switch
                class="pa-0 ma-0"
                :label="$t('aw.autotesting')"
                :input-value="stateLocal.autotesting"
                @change="toggleAutotesting"
              />

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
              {{ $t('aw.chart.humidity') }}
            </h3>
          </v-card-title>
          <v-card-text>
            <highcharts
              :options="chartOptions"
              :constructor-type="'stockChart'"
            />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-dialog
        v-model="dialogWateringMode"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{ $t('aw.wateringMode') }}</v-card-title>
          <v-card-text>
            {{ $t('aw.modalWateringMode') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="dialogWateringMode = false"
            >{{ $t('buttonNO') }}</v-btn>
            <v-btn @click="toggleMode">{{ $t('buttonYES') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogAutomaticWatering"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{ $t('aw.automaticWatering') }}</v-card-title>
          <v-card-text>
            {{ $t('aw.modalAutomaticWatering') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="dialogAutomaticWatering = false"
            >{{ $t('buttonNO') }}</v-btn>
            <v-btn @click="toggleAutomaticWatering">{{ $t('buttonYES') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>


<script>
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
stockInit(Highcharts);

import { Chart } from 'highcharts-vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    highcharts: Chart,
  },

  data() {
    return {
      dialogWateringMode: false,
      dialogAutomaticWatering: false,
    };
  },

  computed: {
    id() {
      return this.$store.getters['activeIndexDevice'];
    },

    stateLocal() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },

    color() {
      const h = this.stateLocal.humidity;
      if (h < 10) return 'brown';
      if (h < 35) return 'amber';
      if (h < 50) return 'lime';
      if (h < 60) return 'light-green';
      if (h < 70) return 'green';
      if (h < 90) return 'blue';
      return 'red';
    },

    lastHumidity() {
      return this.stateLocal.dataHumidity[this.stateLocal.dataHumidity.length - 1];
    },

    chartOptions() {
      const data = this.stateLocal;
      const series = [];

      let interval = 86400000;
      if (data.wateringMode) interval = 3600000;

      data.dataHumidity.forEach((value, i) => {
        series.push([data.dateWatering + i * interval, value]);
      });

      return {
        redraw: true,
        rangeSelector: {
          buttons: [
            {
              type: 'hour',
              count: 5,
              text: `5${this.$t('aw.chart.h')}`,
            },
            {
              type: 'hour',
              count: 12,
              text: `12${this.$t('aw.chart.h')}`,
            },
            {
              type: 'day',
              count: 1,
              text: `1${this.$t('aw.chart.d')}`,
            },
            {
              type: 'day',
              count: 3,
              text: `3${this.$t('aw.chart.d')}`,
            },
            {
              type: 'day',
              count: 7,
              text: `7${this.$t('aw.chart.d')}`,
            },
            {
              type: 'all',
              text: `${this.$t('aw.chart.all')}`,
            },
          ],
          inputEnabled: false,
          selected: 0,
        },
        tooltip: {
          valueSuffix: '%',
        },
        yAxis: {
          plotLines: [
            {
              value: data.humidity,
              color: 'red',
              dashStyle: 'solid',
              width: 2,
              label: {
                text: `${this.$t('aw.chart.humidityMinimum')}`,
              },
            },
          ],
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        series: [
          {
            name: `${this.$t('aw.chart.humidity')}`,
            type: 'spline',
            data: series,
          },
        ],
      };
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

    startTimerNextFeeding: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/startTimerNextFeeding`);
    },

    restart: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/restart`);
    },

    systemCheck: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/systemCheck`);
    },

    setHumidity: function(payload) {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/setHumidity`, payload);
    },

    toggleAutomaticWatering: function() {
      this.dialogAutomaticWatering = false;
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/toggleAutomaticWatering`);
    },

    toggleSensorAnalysis: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/toggleSensorAnalysis`);
    },

    toggleAutotesting: function() {
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/toggleAutotesting`);
    },

    toggleMode: function() {
      this.dialogWateringMode = false;
      this.$store.dispatch(`${this.$store.getters['activeIndexDevice']}/toggleMode`);
    },

    toggleDialogAutomaticWatering: function() {
      this.dialogAutomaticWatering = true;
    },
  },

  created() {
    this.startTimerNextFeeding();
  },
};
</script>


<style>
.xxl-text {
  font-size: 2.25rem;
}

.currentH {
  pointer-events: none;
}

.currentH .v-slider__thumb {
  background-color: #aaa !important;
}

.currentH .v-slider__thumb::after {
  content: '↓';
  font-size: 75px;
  position: relative;
  left: -6px;
  color: #aaa;
}
</style>
