const { Transaction, Portfolio, User } = require('../models/Model');
const axios = require('axios');
const { Op } = require('sequelize');
const { COINGECKO_API_KEY } = require('../config/api');

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
    const { coin_name, amount_usd } = req.body;

    // Get current price from CoinGecko
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin_name.toLowerCase()}&vs_currencies=usd`,
      {
        headers: {
          'x-cg-demo-api-key': COINGECKO_API_KEY,
          'accept': 'application/json'
        }
      }
    );
    const currentPrice = priceResponse.data[coin_name.toLowerCase()]?.usd;

    if (!currentPrice) {
      return res.status(400).json({ error: 'Invalid coin name' });
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
        coin_name
      }
    });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        user_id: req.user.id,
        coin_name,
        total_coin: amountCoin,
        image_url: `https://assets.coingecko.com/coins/images/1/large/${coin_name.toLowerCase()}.png`
      });
    } else {
      portfolio.total_coin = parseFloat(portfolio.total_coin) + amountCoin;
      await portfolio.save();
    }

    // Create transaction
    const transaction = await Transaction.create({
      user_id: req.user.id,
      portfolio_id: portfolio.id,
      coin_name,
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
    const { coin_name, amount_coin } = req.body;

    // Get current price from CoinGecko
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin_name.toLowerCase()}&vs_currencies=usd`,
      {
        headers: {
          'x-cg-demo-api-key': COINGECKO_API_KEY,
          'accept': 'application/json'
        }
      }
    );
    const currentPrice = priceResponse.data[coin_name.toLowerCase()]?.usd;

    if (!currentPrice) {
      return res.status(400).json({ error: 'Invalid coin name' });
    }

    const amountUsd = amount_coin * currentPrice;
    const portfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        coin_name
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
      coin_name,
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
    const { amount_coin, total_value, type, coin_name } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (amount_coin) transaction.amount_coin = amount_coin;
    if (total_value) transaction.total_value = total_value;
    if (type) transaction.type = type;
    if (coin_name) transaction.coin_name = coin_name;

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