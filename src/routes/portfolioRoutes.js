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
router.put('/:symbol', auth, updatePortfolio);
router.delete('/:symbol', auth, deletePortfolio);

module.exports = router; 