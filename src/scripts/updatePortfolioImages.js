const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Portfolio } = require('../models/Model');
const axios = require('axios');
const { COINGECKO_API_KEY } = require('../config/api');
const sequelize = require('../config/database');

const updatePortfolioImages = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Get all unique coin names from portfolio
    const portfolios = await Portfolio.findAll({
      attributes: ['coin_name'],
      group: ['coin_name']
    });

    console.log(`Found ${portfolios.length} unique coins to update`);

    for (const portfolio of portfolios) {
      const coinId = portfolio.coin_name.toLowerCase();
      
      try {
        // Fetch coin details from CoinGecko
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}`,
          {
            headers: {
              'x-cg-demo-api-key': COINGECKO_API_KEY,
              'accept': 'application/json'
            }
          }
        );

        const imageUrl = response.data?.image?.large;
        
        if (imageUrl) {
          // Update all portfolios with this coin name
          await Portfolio.update(
            { image_url: imageUrl },
            { where: { coin_name: portfolio.coin_name } }
          );
          console.log(`Updated image URL for ${portfolio.coin_name}`);
        } else {
          console.log(`No image URL found for ${portfolio.coin_name}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error updating ${portfolio.coin_name}:`, error.message);
      }
    }

    console.log('Portfolio image update completed');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Run the update
updatePortfolioImages(); 