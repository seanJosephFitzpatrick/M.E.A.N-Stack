'use strict';

/**
 * Module dependencies.
 */
var clubsPolicy = require('../policies/clubs.server.policy'),
  clubs = require('../controllers/clubs.server.controller');

module.exports = function (app) {
  // Clubs collection routes
  app.route('/api/clubs').all(clubsPolicy.isAllowed)
    .get(clubs.list)
    .post(clubs.create);

  // Single club routes
  app.route('/api/clubs/:clubId').all(clubsPolicy.isAllowed)
    .get(clubs.read)
    .put(clubs.update)
    .delete(clubs.delete);

  // Finish by binding the club middleware
  app.param('clubId', clubs.clubByID);
};
