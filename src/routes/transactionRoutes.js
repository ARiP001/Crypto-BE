const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTransactions,
  buyCoin,
  sellCoin,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.get('/', auth, getTransactions);
router.post('/buy', auth, buyCoin);
router.post('/sell', auth, sellCoin);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router; 