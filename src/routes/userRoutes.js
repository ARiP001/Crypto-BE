const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updateBalance,
  deleteAccount
} = require('../controllers/userController');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.put('/me/balance', auth, updateBalance);
router.delete('/me', auth, deleteAccount);

module.exports = router; 