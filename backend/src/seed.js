const dotenv = require('dotenv');
const { connectDb } = require('./config/db');
const Machine = require('./models/Machine');

dotenv.config();

const machines = ['CC4001', 'CC4002', 'TORTILLA', 'CC3000', 'PC10', 'PC14'];

const run = async () => {
  await connectDb();
  await Machine.deleteMany({});
  await Machine.insertMany(machines.map((name) => ({ name })));
  // eslint-disable-next-line no-console
  console.log('Machines seeded');
  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', error);
  process.exit(1);
});
