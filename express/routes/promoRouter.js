const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const promotions = require('../models/promotions');

var authenticate = require('../authenticate');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        promotions.create(req.body)
            .then((promotion) => {
                console.log('promotion Created ', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promotionId')
    .get((req, res, next) => {
        promotions.findById(req.params.promotionId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + req.params.promotionId);
    })
    .put((req, res, next) => {
        promotions.findByIdAndUpdate(req.params.promotionId, {
                $set: req.body
            }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        promotions.findByIdAndRemove(req.params.promotionId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promotionId/comments')
    .get((req, res, next) => {
        promotions.findById(req.params.promotionId)
            .then((promotion) => {
                if (promotion != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion.comments);
                } else {
                    err = new Error('promotion ' + req.params.promotionId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        promotions.findById(req.params.promotionId)
            .then((promotion) => {
                if (promotion != null) {
                    promotion.comments.push(req.body);
                    promotion.save()
                        .then((promotion) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        }, (err) => next(err));
                } else {
                    err = new Error('promotion ' + req.params.promotionId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions/' +
            req.params.promotionId + '/comments');
    })
    .delete((req, res, next) => {
        promotions.findById(req.params.promotionId)
            .then((promotion) => {
                if (promotion != null) {
                    for (let i = (promotion.comments.length - 1); i >= 0; i--) {
                        promotion.comments.id(promotion.comments[i]._id).remove();
                    }
                    promotion.save()
                        .then((promotion) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        }, (err) => next(err));
                } else {
                    err = new Error('promotion ' + req.params.promotionId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = promoRouter;