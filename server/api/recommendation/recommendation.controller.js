'use strict';

var _ = require('lodash');
var Recommendation = require('./recommendation.model');

// Get list of recommendations
exports.index = function(req, res) {
  Recommendation.
    find().
    populate("user").
    sort("-created").
    exec(function (err, recommendations) {
      if(err) { return handleError(res, err); }
      return res.json(200, recommendations);
  });
};

// Get list of recommendations by movie id
exports.getByMovie = function(req, res) {
  Recommendation.
    find({'movie':req.params.movieId}).
    populate("user").
    sort("-created").
    exec(function (err, recommendations) {
      if(err) { return handleError(res, err); }
      return res.json(200, recommendations);
    });
};

// Get list of recommendations by user id
exports.getByUser = function(req, res) {
  Recommendation.
  find({'user':req.params.userId}).
  sort("-created").
  exec(function (err, recommendations) {
    if(err) { return handleError(res, err); }
    return res.json(200, recommendations);
  });
};

// Count recommendations for each movie
exports.countRecommendations = function(req, res) {
  Recommendation.
  aggregate(
    { $group: 
      { _id: '$movie', recommendation_count: { $sum: 1 } } 
    }).
  exec(function (err, recommendation) {
    if (err) { return handleError(res, err); }
    res.send(200, recommendation);
  }); 
};

// Get a single recommendation
exports.show = function(req, res) {
  Recommendation.findById(req.params.id, function (err, recommendation) {
    if(err) { return handleError(res, err); }
    if(!recommendation) { return res.send(404); }
    return res.json(recommendation);
  });
};

// Creates a new recommendation in the DB.
exports.create = function(req, res) {
  Recommendation.create(req.body, function(err, recommendation) {
    if(err) { return handleError(res, err); }
    return res.json(201, recommendation);
  });
};

// Updates an existing recommendation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Recommendation.findById(req.params.id, function (err, recommendation) {
    if (err) { return handleError(res, err); }
    if(!recommendation) { return res.send(404); }
    var updated = _.merge(recommendation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, recommendation);
    });
  });
};

// Deletes a recommendation from the DB.
exports.destroy = function(req, res) {
  Recommendation.findById(req.params.id, function (err, recommendation) {
    if(err) { return handleError(res, err); }
    if(!recommendation) { return res.send(404); }
    recommendation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}