const User = require('./User');
const Portfolio = require('./Portfolio');
const Transaction = require('./Transaction');

// User - Portfolio associations
User.hasMany(Portfolio, { foreignKey: 'user_id' });
Portfolio.belongsTo(User, { foreignKey: 'user_id' });

// User - Transaction associations
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Portfolio - Transaction associations
Portfolio.hasMany(Transaction, { foreignKey: 'portfolio_id' });
Transaction.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

module.exports = {
  User,
  Portfolio,
  Transaction
}; 