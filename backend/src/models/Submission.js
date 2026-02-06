const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema(
  {
    hasIncident: { type: Boolean, default: false },
    description: { type: String, default: '' },
    photoUrl: { type: String, default: '' }
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    workerName: { type: String, required: true, trim: true },
    shift: { type: String, enum: ['E1', 'E2', 'E3', 'E4'], required: true },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, required: true },
    totalMinutes: { type: Number, required: true },
    beforePhotoUrl: { type: String, required: true },
    afterPhotoUrl: { type: String, default: '' },
    checklist: { type: [Boolean], default: [] },
    incidents: { type: IncidentSchema, default: () => ({}) },
    status: { type: String, enum: ['In Process', 'Completed'], default: 'Completed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', SubmissionSchema);
