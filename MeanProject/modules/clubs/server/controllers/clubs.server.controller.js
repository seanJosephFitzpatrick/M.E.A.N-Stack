'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Club = mongoose.model('Club'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a club
 */
exports.create = function (req, res) {
  var club = new Club(req.body);
  club.user = req.user;

  club.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(club);
    }
  });
};

/**
 * Show the current club
 */
exports.read = function (req, res) {
  res.json(req.club);
};

/**
 * Update a club
 */
exports.update = function (req, res) {
  var club = req.club;

  club.title = req.body.title;
  club.content = req.body.content;

  club.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(club);
    }
  });
};

/**
 * Delete an club
 */
exports.delete = function (req, res) {
  var club = req.club;

  club.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(club);
    }
  });
};

/**
 * List of Clubs
 */
exports.list = function (req, res) {
  Club.find().sort('-created').populate('user', 'displayName').exec(function (err, clubs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(clubs);
    }
  });
};

/**
 * Club middleware
 */
exports.clubByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Club is invalid'
    });
  }

  Club.findById(id).populate('user', 'displayName').exec(function (err, club) {
    if (err) {
      return next(err);
    } else if (!club) {
      return res.status(404).send({
        message: 'No club with that identifier has been found'
      });
    }
    req.club = club;
    next();
  });
};
