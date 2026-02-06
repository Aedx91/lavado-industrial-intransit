const express = require('express');
const Machine = require('../models/Machine');
const { logger } = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const sortSpec = { name: 1 };
  const query = Machine.find().sort(sortSpec);

  logger.warn('Query with sort', { collection: 'machines', sort: sortSpec });
  if (process.env.MONGO_SORT_HINT_NAME === 'true') {
    query.hint(sortSpec);
  }

  const machines = await query;
  res.json(machines);
});

module.exports = router;
