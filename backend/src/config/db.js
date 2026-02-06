const mongoose = require('mongoose');

const ensureQueryParam = (uri, key, value) => {
  const hasQuery = uri.includes('?');
  const hasKey = uri.toLowerCase().includes(`${key.toLowerCase()}=`);
  if (hasKey) {
    return uri;
  }
  const joiner = hasQuery ? '&' : '?';
  return `${uri}${joiner}${key}=${value}`;
};

const ensureAppName = (uri) => {
  if (uri.toLowerCase().includes('appname=')) {
    return uri;
  }
  const hostMatch = uri.match(/@([^:/?]+)/);
  if (!hostMatch) {
    return uri;
  }
  const host = hostMatch[1];
  if (!host.endsWith('.mongo.cosmos.azure.com')) {
    return uri;
  }
  const accountName = host.split('.')[0];
  return ensureQueryParam(uri, 'appName', `@${accountName}@`);
};

const connectDb = async () => {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  uri = uri.replace(/`/g, '');

  if (String(process.env.USE_SSL).toLowerCase() === 'true') {
    uri = ensureQueryParam(uri, 'ssl', 'true');
  }
  uri = ensureQueryParam(uri, 'retrywrites', 'false');
  uri = ensureAppName(uri);

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 50,
    retryWrites: false
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

module.exports = { connectDb };
