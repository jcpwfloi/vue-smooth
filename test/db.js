const Smooth = require('../dist/vue-smooth.min');

const Notice = new Smooth({
  username: String,
  content: String
});

const app = require('./express');

Notice.register(app, '/notices');

