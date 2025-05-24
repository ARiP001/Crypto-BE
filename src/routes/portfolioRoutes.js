const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

router.get('/', auth, getPortfolio);
router.post('/', auth, createPortfolio);
router.put('/:coin_name', auth, updatePortfolio);
router.delete('/:coin_name', auth, deletePortfolio);

module.exports = router; 