const User = require('./user.model');

class UserController {
  static async getById(id) {
    if (!id) throw new Error('Dados inválidos');
    const user = await User.findOne({ _id: id }).exec();
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  static getRanking() {
    return User.find({})
      .select('-banned -admin -googleId -email -googleAccessToken -googleRefreshToken -createdAt -updatedAt -__v')
      .sort({ points: -1 })
      .limit(15)
      .exec();
  }

  static addPoints(id, points) {
    return User.findByIdAndUpdate(id, { $inc: { points } }).exec();
  }

  static async updateOrCreate(userObj) {
    const escapedName = escape(userObj.name);

    let user = await User.findOne({
      googleId: userObj.googleId,
    }).exec();

    if (!user) {
      user = new User();
      user.googleId = userObj.googleId;
      user.name = escapedName;
      user.picture = userObj.picture;
      user.email = userObj.email;
      user.googleAccessToken = userObj.googleAccessToken;
      user.googleRefreshToken = userObj.googleRefreshToken;
      return user.save();
    }

    user.name = escapedName;
    user.picture = userObj.picture;
    user.email = userObj.email;
    user.googleAccessToken = userObj.googleAccessToken;
    user.googleRefreshToken = userObj.googleRefreshToken;
    return user.save();
  }
}

module.exports = UserController;
