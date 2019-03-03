<template>
  <v-dialog
    v-model="showConnectModal"
    persistent
    max-width="450"
  >
    <v-card>

      <v-card-title class="headline">
        {{ $t('connectionSettings') }}

      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="form.validForm"
        >
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex
                xs12
                sm6
                md8
              >
                <v-text-field
                  @input="setIP"
                  :value='ip'
                  :label="$t('ip')"
                  :autofocus="true"
                  :rules="form.ipRules"
                  required
                  box
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  @input="setPort"
                  :value='port'
                  :label="$t('port')"
                  :rules="form.portRules"
                  required
                  box
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="form.password"
                  :label="$t('password')"
                  :type="form.showPassword ? 'text' : 'password'"
                  :append-icon="form.showPassword ? 'visibility_off' : 'visibility'"
                  @click:append="form.showPassword = !form.showPassword"
                  box
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>

      </v-card-text>
      <v-progress-linear
        v-show="isLoadDevice"
        :indeterminate="true"
        height="20"
        color="blue"
      ></v-progress-linear>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          flat
          color="red darken-1"
          @click="close()"
        >
          {{ $t('close') }}
        </v-btn>

        <v-btn
          flat
          color="blue darken-1"
          @click="validationForm()"
          :disabled="isLoadDevice"
        >
          {{ $t('connect') }}

        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { IP_REGEXP } from '@/utils/regexp';

export default {
  name: 'z-connection-modal',

  data: function() {
    return {
      form: {
        validForm: false,

        ipRules: [
          v => !!v || this.$i18n.t('error.IpRequired'),
          v => IP_REGEXP.test(v) || this.$i18n.t('error.IpInvalid'),
        ],
        portRules: [
          v => !!v || this.$i18n.t('error.portRequired'),
          v => (v <= 65535 && v > 0) || this.$i18n.t('error.portInvalid'),
        ],

        password: null,
        showPassword: false,
      },
    };
  },

  computed: {
    ...mapGetters(['devices', 'showConnectModal', 'isLoadDevice', 'ip', 'port']),
  },

  methods: {
    ...mapActions(['toggleConnectModal', 'connectDevice', 'setIP', 'setPort']),

    validationForm: function() {
      if (this.$refs.form.validate()) {
        this.connectDevice(this.password);
      }
    },

    close: function() {
      this.$refs.form.resetValidation();
      if (this.devices.length) this.toggleConnectModal();
    },
  },

  mounted() {
    if (this.devices.length === 0) this.toggleConnectModal();
  },
};
</script>

<style>
</style>
