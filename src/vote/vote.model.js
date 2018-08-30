const mongoose = require('../../db');

const { Schema } = mongoose;

// create a schema
const modelSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  word: { type: Schema.Types.ObjectId, ref: 'Word' },
  vote: { type: Number },
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

const Vote = mongoose.model('Vote', modelSchema);

module.exports = Vote;
