const { Portfolio } = require('../models/Model');
const axios = require('axios');
const { COINGECKO_API_KEY } = require('../config/api');

const getPortfolio = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({
      where: { user_id: req.user.id }
    });

    // Get current prices from CoinGecko
    const coinNames = portfolios.map(p => p.coin_name.toLowerCase());
    const prices = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinNames.join(',')}&vs_currencies=usd`,
      {
        headers: {
          'x-cg-demo-api-key': COINGECKO_API_KEY,
          'accept': 'application/json'
        }
      }
    );

    const portfoliosWithPrices = portfolios.map(portfolio => {
      const price = prices.data[portfolio.coin_name.toLowerCase()]?.usd || 0;
      return {
        ...portfolio.toJSON(),
        current_price: price,
        total_value: price * parseFloat(portfolio.total_coin)
      };
    });

    res.json(portfoliosWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const { coin_name, total_coin, image_url } = req.body;

    const existingPortfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        coin_name
      }
    });

    if (existingPortfolio) {
      return res.status(400).json({ error: 'Portfolio for this coin already exists' });
    }

    const portfolio = await Portfolio.create({
      user_id: req.user.id,
      coin_name,
      total_coin,
      image_url
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { coin_name } = req.params;
    const { total_coin } = req.body;

    const portfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        coin_name
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.total_coin = total_coin;
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { coin_name } = req.params;

    const portfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        coin_name
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (parseFloat(portfolio.total_coin) !== 0) {
      return res.status(400).json({ error: 'Cannot delete portfolio with non-zero balance' });
    }

    await portfolio.destroy();
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
}; 