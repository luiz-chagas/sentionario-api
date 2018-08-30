const mongoose = require('../../db');

const { Schema } = mongoose;

// create a schema
const modelSchema = new Schema({
  name: { type: String },
  total: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  average: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  votes1: { type: Number, default: 0 },
  votes2: { type: Number, default: 0 },
  votes3: { type: Number, default: 0 },
  votes4: { type: Number, default: 0 },
  votes5: { type: Number, default: 0 },
  votes6: { type: Number, default: 0 },
  votes7: { type: Number, default: 0 },
  votes8: { type: Number, default: 0 },
  votes9: { type: Number, default: 0 },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

modelSchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

const Word = mongoose.model('Word', modelSchema);

module.exports = Word;
