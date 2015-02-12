'use strict';

var express = require('express');
var controller = require('./recommendation.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/movie/:movieId', controller.getByMovie);
router.get('/user/:userId', controller.getByUser);
router.get('/count/count', controller.countRecommendations);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;