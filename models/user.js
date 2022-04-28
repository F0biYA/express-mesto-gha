const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // имя пользователя, строка от 2 до 30 символов, обязательное поле
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // информация о пользователе, строка от 2 до 30 символов, обязательное поле;
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // ссылка на аватарку, строка, обязательное поле.
  avatar: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('user', userSchema);
