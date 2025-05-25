const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTopCoins,
  getCoinDetail,
  getCoinHistory
} = require('../controllers/coinController');
const { COINGECKO_API_KEY } = require('../config/api');

// Test endpoint to verify API key
router.get('/test-key', (req, res) => {
  res.json({ apiKey: COINGECKO_API_KEY });
});

router.get('/', auth, getTopCoins);
router.get('/:coin_name', auth, getCoinDetail);
router.get('/:coin_name/history', auth, getCoinHistory);

module.exports = router; 