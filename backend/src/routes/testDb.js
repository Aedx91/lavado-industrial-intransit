const express = require('express');
const TestPing = require('../models/TestPing');
const { logger } = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const latest = await TestPing.collection.findOne({});
    return res.json({ success: true, latest });
  } catch (error) {
    logger.error('Test DB read failed', { error: error.message });
    return res.status(500).json({ success: false, errors: ['Error interno al leer la base'] });
  }
});

router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const result = await TestPing.collection.insertOne({ test: 'ping', createdAt: now, updatedAt: now });
    const insertedId = result.insertedId;
    const readBack = await TestPing.collection.findOne({ _id: insertedId });
    const deleteResult = await TestPing.collection.deleteOne({ _id: insertedId });
    return res.status(201).json({
      success: true,
      docId: insertedId,
      readBack: Boolean(readBack),
      deleted: deleteResult?.deletedCount === 1
    });
  } catch (error) {
    logger.error('Test DB write failed', { error: error.message });
    return res.status(500).json({ success: false, errors: ['Error interno al escribir en la base'] });
  }
});

module.exports = router;
