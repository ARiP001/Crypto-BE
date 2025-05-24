const { Transaction, Portfolio, User } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buyCoin = async (req, res) => {
  try {
    const { symbol, amount_usd } = req.body;

    // Get current price from CoinGecko
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
    );
    const currentPrice = priceResponse.data[symbol.toLowerCase()]?.usd;

    if (!currentPrice) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }

    const amountCoin = amount_usd / currentPrice;
    const user = await User.findByPk(req.user.id);

    if (parseFloat(user.balance) < amount_usd) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update user balance
    user.balance = parseFloat(user.balance) - amount_usd;
    await user.save();

    // Find or create portfolio
    let portfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        symbol
      }
    });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        user_id: req.user.id,
        symbol,
        total_coin: amountCoin,
        image_url: `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`
      });
    } else {
      portfolio.total_coin = parseFloat(portfolio.total_coin) + amountCoin;
      await portfolio.save();
    }

    // Create transaction
    const transaction = await Transaction.create({
      user_id: req.user.id,
      portfolio_id: portfolio.id,
      symbol,
      type: 'buy',
      amount_coin: amountCoin,
      total_value: amount_usd
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sellCoin = async (req, res) => {
  try {
    const { symbol, amount_coin } = req.body;

    // Get current price from CoinGecko
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
    );
    const currentPrice = priceResponse.data[symbol.toLowerCase()]?.usd;

    if (!currentPrice) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }

    const amountUsd = amount_coin * currentPrice;
    const portfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        symbol
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (parseFloat(portfolio.total_coin) < amount_coin) {
      return res.status(400).json({ error: 'Insufficient coin balance' });
    }

    // Update portfolio
    portfolio.total_coin = parseFloat(portfolio.total_coin) - amount_coin;
    await portfolio.save();
    

    // Update user balance
    const user = await User.findByPk(req.user.id);
    user.balance = parseFloat(user.balance) + amountUsd;
    await user.save();

    // Create transaction
    const transaction = await Transaction.create({
      user_id: req.user.id,
      portfolio_id: portfolio.id,
      symbol,
      type: 'sell',
      amount_coin,
      total_value: amountUsd
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_coin, total_value, type, symbol } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (amount_coin) transaction.amount_coin = amount_coin;
    if (total_value) transaction.total_value = total_value;
    if (type) transaction.type = type;
    if (symbol) transaction.symbol = symbol;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTransactions,
  buyCoin,
  sellCoin,
  updateTransaction,
  deleteTransaction
}; 