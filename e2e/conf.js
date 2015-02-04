/**
 * Created by mike on 2/4/2015.
 */
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['**/*.spec.js'],
  baseUrl: '',
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    showColors: true
  },
  env: {
    baseUrl: 'http://localhost:3444/#'
  },

  onPrepare: function() {
  }
};
