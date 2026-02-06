const express = require('express');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const { calculateMinutes } = require('../utils/time');
const { logger } = require('../utils/logger');

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

    const errors = [];
    if (!machineId) errors.push("Campo 'Maquina' requerido");
    if (!workerName) errors.push("Campo 'Nombre del trabajador' requerido");
    if (!shift) errors.push("Campo 'Turno' requerido");
    if (shift && !['E1', 'E2', 'E3', 'E4'].includes(shift)) {
      errors.push("Turno invalido");
    }
    if (!startedAt) errors.push("Campo 'Inicio' requerido");
    if (!finishedAt) errors.push("Campo 'Fin' requerido");

    const startDate = startedAt ? new Date(startedAt) : null;
    const endDate = finishedAt ? new Date(finishedAt) : null;
    if (startDate && endDate && endDate <= startDate) {
      errors.push('La hora de fin debe ser mayor que la hora de inicio');
    }

    const beforePhotoFile = req.files?.beforePhoto?.[0];
    if (!beforePhotoFile) {
      errors.push("Foto 'Antes' requerida");
    }

    if (errors.length) {
      logger.warn('Submit failed validation', { errors });
      return res.status(400).json({ success: false, errors });
    }

    const beforePhotoUrl = beforePhotoFile?.path || '';

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

    logger.info('Submission created', { submissionId: submission._id.toString() });
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
