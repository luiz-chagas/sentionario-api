const UserController = require('./user.controller');

exports.getRanking = async (req, res) => {
  res.json({ data: await UserController.getRanking() });
};

exports.getUser = async (req, res) => {
  res.json({ data: await UserController.getById(req.params.id) });
};
