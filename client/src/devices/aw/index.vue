<template>
  <div>
    automaticWatering {{ data.automaticWatering }}
    <br>
    autotesting {{ data.autotesting }}
    <br>
    dateWatering {{ data.dateWatering }}
    <br>
    humidity {{ data.humidity }}
    <br>
    microcontroller {{ data.microcontroller }}
    <br>
    sensorAnalysis {{ data.sensorAnalysis }}
    <br>
  </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex';

export default {
  // name: 'z-connection-modal',

  // data: function() {
  //   return {
  //     form: {
  //       validForm: false,

  //       ip: '127.0.0.1',
  //       // ip: null,
  //       ipRules: [
  //         v => !!v || this.$i18n.t('error.IpRequired'),
  //         v => IP_REGEXP.test(v) || this.$i18n.t('error.IpInvalid'),
  //       ],

  //       port: 3001,
  //       // port: null,
  //       portRules: [
  //         v => !!v || this.$i18n.t('error.portRequired'),
  //         v => (v <= 65535 && v > 0) || this.$i18n.t('error.portInvalid'),
  //       ],

  //       password: null,
  //       showPassword: false,
  //     },
  //   };
  // },

  computed: {
    id() {
      console.log(this.$store);
      return this.$store.getters['activeIndexDevice'];
    },

    data() {
      return this.$store.state[this.$store.getters['activeIndexDevice']];
    },
  },

  // methods: {
  //   ...mapActions(['toggleConnectModal', 'connectDevice']),

  //   validationForm: function() {
  //     if (this.$refs.form.validate()) {
  //       this.connectDevice(this.form);
  //     }
  //   },

  //   close: function() {
  //     this.$refs.form.resetValidation();
  //     if (this.devices.length) this.toggleConnectModal();
  //   },
  // },

  // props: {
  //   device: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  created() {
    const { socket } = this.data;

    socket.onmessage = data => {
      const message = JSON.parse(data.data);
      console.log(message);
    };

    socket.onerror = () => {
      // commit('ADD_ALERT', { type: 'warning', message: 'error.connect' });
      // commit('TOGGLE_LOAD_DEVICE');
      socket.close();
    };

    socket.onclose = event => {
      if (event.wasClean) {
        socket.close();
        // commit('ADD_ALERT', { type: 'warning', message: 'error.disconnect' });
      }
    };
  },
};
</script>


<style>
</style>
