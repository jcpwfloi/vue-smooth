const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Testing server listening on port ${port}`);
});

module.exports = app;
