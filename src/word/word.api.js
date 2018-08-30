const WordController = require('./word.controller');

exports.getDicionario = async (req, res) => {
  res.json({ data: await WordController.getDictionary() });
};

exports.getPalavras = async (req, res) => {
  const { search } = req.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;

  res.json({ data: await WordController.getWords(search, page - 1, limit) });
};

exports.getPalavra = async (req, res) => {
  const { name } = req.params;
  res.json({ data: await WordController.getSingleWord(name) });
};

exports.addPalavra = async (req, res) => {
  const { name } = req.body;
  res.json({ data: await WordController.addWord(name) });
};
