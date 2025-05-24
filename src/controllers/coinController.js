const axios = require('axios');

const getTopCoins = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false
        }
      }
    );

    const coins = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image_url: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h
    }));

    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoinDetail = async (req, res) => {
  try {
    const { coin_name } = req.params;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin_name.toLowerCase()}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false
        }
      }
    );

    const coin = {
      id: response.data.id,
      symbol: response.data.symbol.toUpperCase(),
      name: response.data.name,
      image_url: response.data.image.large,
      current_price: response.data.market_data.current_price.usd,
      market_cap: response.data.market_data.market_cap.usd,
      price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
      price_change_percentage_7d: response.data.market_data.price_change_percentage_7d,
      price_change_percentage_30d: response.data.market_data.price_change_percentage_30d,
      total_volume: response.data.market_data.total_volume.usd,
      high_24h: response.data.market_data.high_24h.usd,
      low_24h: response.data.market_data.low_24h.usd
    };

    res.json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoinHistory = async (req, res) => {
  try {
    const { coin_name } = req.params;
    const { days = 7 } = req.query;

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin_name.toLowerCase()}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days
        }
      }
    );

    const prices = response.data.prices.map(([timestamp, price]) => ({
      timestamp,
      price
    }));

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTopCoins,
  getCoinDetail,
  getCoinHistory
}; 