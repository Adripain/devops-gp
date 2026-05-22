require('dotenv').config();

const { createApp } = require('./app');
const { initDb } = require('./db');

const port = Number(process.env.PORT || 3000);

async function start() {
  await initDb();
  const app = createApp();
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
