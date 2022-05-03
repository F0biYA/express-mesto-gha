// импорт модели карточек
const Card = require('../models/card');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

/* найти все карточки */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

/* созать карточку (имя, ссылка, владелец-id) */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

/* удалить карточку  */
module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(id)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }))
          .catch(() => next(new NotFoundError('Карточка не найдена')));
      } else {
        throw new ForbiddenError('Нет прав для удаление данной карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

/* лайкнуть карточку  */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким idне найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

/* дизлайкнуть карточку */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким idне найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
