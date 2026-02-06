const express = require('express');
const Submission = require('../models/Submission');

const router = express.Router();

router.get('/', async (req, res) => {
  const { date } = req.query;
  const filter = {};

  if (date) {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    filter.startedAt = { $gte: dayStart, $lte: dayEnd };
  }

  const submissions = await Submission.find(filter).populate('machine');

  const summary = submissions.reduce((acc, submission) => {
    const machineName = submission.machine?.name || 'Sin máquina';
    if (!acc[machineName]) {
      acc[machineName] = {
        machine: machineName,
        incidents: 0,
        lastCompletedAt: null,
        shifts: { E1: null, E2: null, E3: null, E4: null }
      };
    }

    const machineSummary = acc[machineName];
    if (submission.incidents?.hasIncident) {
      machineSummary.incidents += 1;
    }

    machineSummary.shifts[submission.shift] = 'Completed';

    if (!machineSummary.lastCompletedAt || submission.finishedAt > machineSummary.lastCompletedAt) {
      machineSummary.lastCompletedAt = submission.finishedAt;
    }

    return acc;
  }, {});

  res.json(Object.values(summary));
});

module.exports = router;
