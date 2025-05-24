const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const transactionRoutes = require('./transactionRoutes');
const coinRoutes = require('./coinRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/transactions', transactionRoutes);
router.use('/coins', coinRoutes);

module.exports = router; 