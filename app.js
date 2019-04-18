import express from 'express';
import router from './api/routes';

// initialize the app
const app = express();

// mount the global router onto the app
app.use('', router);

const PORT = 3232;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

module.exports = app;