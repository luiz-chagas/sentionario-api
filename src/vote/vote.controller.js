const Vote = require('./vote.model');

const UserController = require('../user/user.controller');
const WordController = require('../word/word.controller');

class VoteController {
  static async addVote(userId, wordId, vote) {
    if (!userId || !wordId) throw new Error('Dados inválidos');

    const [user, word] = await Promise.all([
      UserController.getById(userId),
      WordController.getById(wordId),
    ]);

    const voteExists = await Vote.findOne({ user, word }).exec();
    if (voteExists) throw new Error('Palavra já foi classificada');

    const newVote = new Vote();
    newVote.user = user;
    newVote.word = word;
    newVote.vote = vote;

    await WordController.addVote(word.name, vote);
    await UserController.addPoints(userId, 5);

    return newVote.save();
  }

  static getVotesByUser(userId) {
    return Vote.find({ user: userId }).exec();
  }

  static async getNewWord(userId) {
    let classifiedWords = await this.getVotesByUser(userId);
    classifiedWords = classifiedWords.map(item => item.word);
    return WordController.getDifferentWord(classifiedWords);
  }
}

module.exports = VoteController;
