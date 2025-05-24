const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTopCoins,
  getCoinDetail,
  getCoinHistory
} = require('../controllers/coinController');

router.get('/', auth, getTopCoins);
router.get('/:symbol', auth, getCoinDetail);
router.get('/:symbol/history', auth, getCoinHistory);

module.exports = router; 