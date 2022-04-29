const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const NotFoundError = require('./errors/notFoundError');
// const serverError = require('./errors/serverError');

const app = express();

const { PORT = 3000 } = process.env;

// мидлвэр временного решения авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '626a6fad8e17c918e79f016c', //  _id созданного тестового пользователя
  };
  next();
});

// импортирую роутеры
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаю mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// запускаю роутеры
app.use('/users', userRouter);
app.use('/cards', cardRouter);

// app.use('*', () => {
//   throw new NotFoundError('Страница не найдена');
// });

// app.use(serverError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
