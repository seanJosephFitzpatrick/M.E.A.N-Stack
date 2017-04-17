'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bar = mongoose.model('Bar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a bar
 */
exports.create = function (req, res) {
  var bar = new Bar(req.body);
  bar.user = req.user;

  bar.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bar);
    }
  });
};

/**
 * Show the current bar
 */
exports.read = function (req, res) {
  res.json(req.bar);
};

/**
 * Update a bar
 */
exports.update = function (req, res) {
  var bar = req.bar;

  bar.title = req.body.title;
  bar.content = req.body.content;

  bar.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bar);
    }
  });
};

/**
 * Delete an bar
 */
exports.delete = function (req, res) {
  var bar = req.bar;

  bar.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bar);
    }
  });
};

/**
 * List of Bars
 */
exports.list = function (req, res) {
  Bar.find().sort('-created').populate('user', 'displayName').exec(function (err, bars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bars);
    }
  });
};

/**
 * Bar middleware
 */
exports.barByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bar is invalid'
    });
  }

  Bar.findById(id).populate('user', 'displayName').exec(function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return res.status(404).send({
        message: 'No bar with that identifier has been found'
      });
    }
    req.bar = bar;
    next();
  });
};
