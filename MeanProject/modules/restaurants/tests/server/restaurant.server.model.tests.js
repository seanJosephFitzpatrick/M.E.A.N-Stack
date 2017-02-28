'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Restaurant = mongoose.model('Restaurant');

/**
 * Globals
 */
var user, restaurant;

/**
 * Unit tests
 */
describe('Restaurant Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      restaurant = new Restaurant({
        title: 'Restaurant Title',
        content: 'Restaurant Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return restaurant.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      restaurant.title = '';

      return restaurant.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Restaurant.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
