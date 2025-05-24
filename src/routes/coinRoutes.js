const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTopCoins,
  getCoinDetail,
  getCoinHistory
} = require('../controllers/coinController');

router.get('/', auth, getTopCoins);
router.get('/:coin_name', auth, getCoinDetail);
router.get('/:coin_name/history', auth, getCoinHistory);

module.exports = router; 