const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const token = jwt.sign(
    {
      sub: username,
      role: 'worker'
    },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({ token, role: 'worker' });
});

module.exports = router;
