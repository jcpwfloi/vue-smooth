const Smooth = require('../dist/vue-smooth.min');

const Notice = new Smooth({
  username: String,
  content: String
}, {
  mongooseAddr: 'mongodb://127.0.0.1/test',
  name: 'Notice'
});

const app = require('./express');

Notice.register(app, '/notices');

