const express = require('express');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const { calculateMinutes } = require('../utils/time');

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'beforePhoto', maxCount: 1 },
    { name: 'afterPhoto', maxCount: 1 },
    { name: 'incidentPhoto', maxCount: 1 }
  ]),
  async (req, res) => {
    const { machineId, workerName, shift, startedAt, finishedAt, checklist, incidentDescription, hasIncident } =
      req.body;

    if (!machineId || !workerName || !shift || !startedAt || !finishedAt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const beforePhotoUrl = req.files?.beforePhoto?.[0]?.path || '';
    if (!beforePhotoUrl) {
      return res.status(400).json({ message: 'Before photo is required' });
    }

    const afterPhotoUrl = req.files?.afterPhoto?.[0]?.path || '';
    const incidentPhotoUrl = req.files?.incidentPhoto?.[0]?.path || '';

    const totalMinutes = calculateMinutes(startedAt, finishedAt);

    const submission = await Submission.create({
      machine: machineId,
      workerName,
      shift,
      startedAt,
      finishedAt,
      totalMinutes,
      beforePhotoUrl,
      afterPhotoUrl,
      checklist: Array.isArray(checklist) ? checklist.map((value) => value === 'true' || value === true) : [],
      incidents: {
        hasIncident: hasIncident === 'true' || hasIncident === true,
        description: incidentDescription || '',
        photoUrl: incidentPhotoUrl
      },
      status: 'Completed'
    });

    if (req.app.get('io')) {
      req.app.get('io').emit('submission:created', submission);
    }

    return res.status(201).json(submission);
  }
);

router.get('/', async (req, res) => {
  const submissions = await Submission.find()
    .populate('machine')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(submissions);
});

module.exports = router;
