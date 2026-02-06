const express = require('express');
const Machine = require('../models/Machine');

const router = express.Router();

router.get('/', async (req, res) => {
  const machines = await Machine.find().sort({ name: 1 });
  res.json(machines);
});

module.exports = router;
