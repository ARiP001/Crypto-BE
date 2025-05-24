const { User } = require('../models/Model');
const { Op } = require('sequelize');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'balance', 'created_at']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (username) {
      const existingUser = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: req.user.id }
        }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user.username = username;
    }

    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: req.user.id }
        }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findByPk(req.user.id);

    user.balance = parseFloat(user.balance) + parseFloat(amount);
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.user.id }
    });

    res.clearCookie('token');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateBalance,
  deleteAccount
}; 