const VoteController = require('./vote.controller');

exports.getPalavraVoto = async (req, res) => {
  const result = await VoteController.getNewWord(req.user.id);
  res.json({ data: result });
};

exports.votarPalavra = async (req, res) => {
  const { word, vote } = req.body;
  await VoteController.addVote(req.user.id, word, vote);
  const nextWord = await VoteController.getNewWord(req.user.id);
  res.json({ data: nextWord });
};
