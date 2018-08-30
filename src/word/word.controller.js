const Word = require('./word.model');

class WordController {
  static async getById(id) {
    const word = await Word.findOne({ _id: id }).exec();
    if (!word) throw new Error('Palavra não encontrada');
    return word;
  }

  static getWords(query = '', page = 0, limit = 20) {
    return Word.find({ name: new RegExp(query, 'i') })
      .select('-__v -createdAt -updatedAt')
      .sort({ name: 1 })
      .skip(page * limit)
      .exec();
  }

  static getSingleWord(name) {
    return Word.findOne({ name }).exec();
  }

  static getDictionary() {
    return Word.find({}, { _id: 0, average: 1, name: 1 }).exec();
  }

  static async addWord(input) {
    if (!input) throw new Error('Palavra inválida');
    const name = input.toLowerCase();
    const wordExists = await Word.findOne({ name }).exec();
    if (wordExists) throw new Error('Palavra já existe');
    const newWord = new Word();
    newWord.name = name;
    return newWord.save();
  }

  static async deleteWord(input = '') {
    const name = input.toLowerCase();
    return Word.deleteOne({ name }).exec();
  }

  static async getDifferentWord(unwantedWords) {
    const count = await Word.count({ _id: { $nin: unwantedWords } }).exec();
    const random = Math.floor(Math.random() * count);
    return Word.findOne({ _id: { $nin: unwantedWords } })
      .select('-id -__v -createdAt -updatedAt')
      .skip(random)
      .exec();
  }

  static async addVote(name, number) {
    if (!number || number < 1 || number > 9) throw new Error('Voto inválido');
    if (!name) throw new Error('Palavra inválida');
    const word = await Word.findOne({ name }).exec();
    if (!word) throw new Error('Palavra não encontrada');
    const updatedProp = `votes${number}`;
    word[updatedProp] += 1;
    word.votes += 1;
    word.total += Number(number);
    word.average = Math.floor((word.total / word.votes) * 100) / 100;
    return word.save();
  }
}

module.exports = WordController;
