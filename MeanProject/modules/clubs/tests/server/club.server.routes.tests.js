'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Club = mongoose.model('Club'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, club;

/**
 * Club routes tests
 */
describe('Club CRUD tests', function () {
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

    // Save a user to the test db and create new club
    user.save(function () {
      club = {
        title: 'Club Title',
        content: 'Club Content'
      };

      done();
    });
  });

  it('should be able to save an club if logged in', function (done) {
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

        // Save a new club
        agent.post('/api/clubs')
          .send(club)
          .expect(200)
          .end(function (clubSaveErr, clubSaveRes) {
            // Handle club save error
            if (clubSaveErr) {
              return done(clubSaveErr);
            }

            // Get a list of clubs
            agent.get('/api/clubs')
              .end(function (clubsGetErr, clubsGetRes) {
                // Handle club save error
                if (clubsGetErr) {
                  return done(clubsGetErr);
                }

                // Get clubs list
                var clubs = clubsGetRes.body;

                // Set assertions
                (clubs[0].user._id).should.equal(userId);
                (clubs[0].title).should.match('Club Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an club if not logged in', function (done) {
    agent.post('/api/clubs')
      .send(club)
      .expect(403)
      .end(function (clubSaveErr, clubSaveRes) {
        // Call the assertion callback
        done(clubSaveErr);
      });
  });

  it('should not be able to save an club if no title is provided', function (done) {
    // Invalidate title field
    club.title = '';

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

        // Save a new club
        agent.post('/api/clubs')
          .send(club)
          .expect(400)
          .end(function (clubSaveErr, clubSaveRes) {
            // Set message assertion
            (clubSaveRes.body.message).should.match('Title cannot be blank');

            // Handle club save error
            done(clubSaveErr);
          });
      });
  });

  it('should be able to update an club if signed in', function (done) {
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

        // Save a new club
        agent.post('/api/clubs')
          .send(club)
          .expect(200)
          .end(function (clubSaveErr, clubSaveRes) {
            // Handle club save error
            if (clubSaveErr) {
              return done(clubSaveErr);
            }

            // Update club title
            club.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing club
            agent.put('/api/clubs/' + clubSaveRes.body._id)
              .send(club)
              .expect(200)
              .end(function (clubUpdateErr, clubUpdateRes) {
                // Handle club update error
                if (clubUpdateErr) {
                  return done(clubUpdateErr);
                }

                // Set assertions
                (clubUpdateRes.body._id).should.equal(clubSaveRes.body._id);
                (clubUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of clubs if not signed in', function (done) {
    // Create new club model instance
    var clubObj = new Club(club);

    // Save the club
    clubObj.save(function () {
      // Request clubs
      request(app).get('/api/clubs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single club if not signed in', function (done) {
    // Create new club model instance
    var clubObj = new Club(club);

    // Save the club
    clubObj.save(function () {
      request(app).get('/api/clubs/' + clubObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', club.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single club with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/clubs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Club is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single club which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent club
    request(app).get('/api/clubs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No club with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an club if signed in', function (done) {
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

        // Save a new club
        agent.post('/api/clubs')
          .send(club)
          .expect(200)
          .end(function (clubSaveErr, clubSaveRes) {
            // Handle club save error
            if (clubSaveErr) {
              return done(clubSaveErr);
            }

            // Delete an existing club
            agent.delete('/api/clubs/' + clubSaveRes.body._id)
              .send(club)
              .expect(200)
              .end(function (clubDeleteErr, clubDeleteRes) {
                // Handle club error error
                if (clubDeleteErr) {
                  return done(clubDeleteErr);
                }

                // Set assertions
                (clubDeleteRes.body._id).should.equal(clubSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an club if not signed in', function (done) {
    // Set club user
    club.user = user;

    // Create new club model instance
    var clubObj = new Club(club);

    // Save the club
    clubObj.save(function () {
      // Try deleting club
      request(app).delete('/api/clubs/' + clubObj._id)
        .expect(403)
        .end(function (clubDeleteErr, clubDeleteRes) {
          // Set message assertion
          (clubDeleteRes.body.message).should.match('User is not authorized');

          // Handle club error error
          done(clubDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Club.remove().exec(done);
    });
  });
});
