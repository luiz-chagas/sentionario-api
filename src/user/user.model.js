const mongoose = require('../../db');

const { Schema } = mongoose;

// create a schema
const modelSchema = new Schema({
  name: { type: String },
  email: { type: String },
  picture: { type: String },
  points: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  googleId: { type: String },
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
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

const User = mongoose.model('User', modelSchema);

module.exports = User;
