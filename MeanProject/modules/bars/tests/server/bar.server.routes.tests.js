'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bar = mongoose.model('Bar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bar;

/**
 * Bar routes tests
 */
describe('Bar CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new bar
    user.save(function () {
      bar = {
        title: 'Bar Title',
        content: 'Bar Content'
      };

      done();
    });
  });

  it('should be able to save an bar if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Get a list of bars
            agent.get('/api/bars')
              .end(function (barsGetErr, barsGetRes) {
                // Handle bar save error
                if (barsGetErr) {
                  return done(barsGetErr);
                }

                // Get bars list
                var bars = barsGetRes.body;

                // Set assertions
                (bars[0].user._id).should.equal(userId);
                (bars[0].title).should.match('Bar Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an bar if not logged in', function (done) {
    agent.post('/api/bars')
      .send(bar)
      .expect(403)
      .end(function (barSaveErr, barSaveRes) {
        // Call the assertion callback
        done(barSaveErr);
      });
  });

  it('should not be able to save an bar if no title is provided', function (done) {
    // Invalidate title field
    bar.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new bar
        agent.post('/api/bars')
          .send(bar)
          .expect(400)
          .end(function (barSaveErr, barSaveRes) {
            // Set message assertion
            (barSaveRes.body.message).should.match('Title cannot be blank');

            // Handle bar save error
            done(barSaveErr);
          });
      });
  });

  it('should be able to update an bar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Update bar title
            bar.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing bar
            agent.put('/api/bars/' + barSaveRes.body._id)
              .send(bar)
              .expect(200)
              .end(function (barUpdateErr, barUpdateRes) {
                // Handle bar update error
                if (barUpdateErr) {
                  return done(barUpdateErr);
                }

                // Set assertions
                (barUpdateRes.body._id).should.equal(barSaveRes.body._id);
                (barUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of bars if not signed in', function (done) {
    // Create new bar model instance
    var barObj = new Bar(bar);

    // Save the bar
    barObj.save(function () {
      // Request bars
      request(app).get('/api/bars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single bar if not signed in', function (done) {
    // Create new bar model instance
    var barObj = new Bar(bar);

    // Save the bar
    barObj.save(function () {
      request(app).get('/api/bars/' + barObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', bar.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single bar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single bar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent bar
    request(app).get('/api/bars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No bar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an bar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Delete an existing bar
            agent.delete('/api/bars/' + barSaveRes.body._id)
              .send(bar)
              .expect(200)
              .end(function (barDeleteErr, barDeleteRes) {
                // Handle bar error error
                if (barDeleteErr) {
                  return done(barDeleteErr);
                }

                // Set assertions
                (barDeleteRes.body._id).should.equal(barSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an bar if not signed in', function (done) {
    // Set bar user
    bar.user = user;

    // Create new bar model instance
    var barObj = new Bar(bar);

    // Save the bar
    barObj.save(function () {
      // Try deleting bar
      request(app).delete('/api/bars/' + barObj._id)
        .expect(403)
        .end(function (barDeleteErr, barDeleteRes) {
          // Set message assertion
          (barDeleteRes.body.message).should.match('User is not authorized');

          // Handle bar error error
          done(barDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Bar.remove().exec(done);
    });
  });
});
