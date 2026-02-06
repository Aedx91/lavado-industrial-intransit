const dayjs = require('dayjs');

const calculateMinutes = (startedAt, finishedAt) => {
  const start = dayjs(startedAt);
  const end = dayjs(finishedAt);
  const diff = end.diff(start, 'minute');
  return Math.max(diff, 0);
};

module.exports = { calculateMinutes };
