module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = '';
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
