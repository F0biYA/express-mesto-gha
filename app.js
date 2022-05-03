const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors, Joi } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
/* подключаю mongo */
mongoose.connect('mongodb://localhost:27017/mestodb');

/* импорт ошибок */
const NotFoundError = require('./errors/notFoundError');
const handleError = require('./middlewares/handleError');

/* импорт контролееров */
const { createUser, loginUser } = require('./controllers/users');

/* импорт мидлвера авторизации */
const auth = require('./middlewares/auth');

/* импорт  роутеров */
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
/* обработка HTTP POST запросов, перевод данных в json */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* запуск роутеров без авторизации */
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

/* защита маршрутов авторизацией */
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

/* ошибка при не найденной странице */
app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

/* обработчик ошибок celebrate */
app.use(errors());

/* все не пойманные ошибки приводим к ошибке сервера 500 */
app.use(handleError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
