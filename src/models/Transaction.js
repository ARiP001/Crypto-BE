const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  portfolio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Portfolio',
      key: 'id'
    }
  },
  coin_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false
  },
  amount_coin: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false
  },
  total_value: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Transaction; 