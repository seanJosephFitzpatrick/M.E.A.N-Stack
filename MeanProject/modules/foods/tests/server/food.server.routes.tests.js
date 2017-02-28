'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Food = mongoose.model('Food'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, food;

/**
 * Food routes tests
 */
describe('Food CRUD tests', function () {
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

    // Save a user to the test db and create new food
    user.save(function () {
      food = {
        title: 'Food Title',
        content: 'Food Content'
      };

      done();
    });
  });

  it('should be able to save an food if logged in', function (done) {
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

        // Save a new food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Get a list of foods
            agent.get('/api/foods')
              .end(function (foodsGetErr, foodsGetRes) {
                // Handle food save error
                if (foodsGetErr) {
                  return done(foodsGetErr);
                }

                // Get foods list
                var foods = foodsGetRes.body;

                // Set assertions
                (foods[0].user._id).should.equal(userId);
                (foods[0].title).should.match('Food Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an food if not logged in', function (done) {
    agent.post('/api/foods')
      .send(food)
      .expect(403)
      .end(function (foodSaveErr, foodSaveRes) {
        // Call the assertion callback
        done(foodSaveErr);
      });
  });

  it('should not be able to save an food if no title is provided', function (done) {
    // Invalidate title field
    food.title = '';

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

        // Save a new food
        agent.post('/api/foods')
          .send(food)
          .expect(400)
          .end(function (foodSaveErr, foodSaveRes) {
            // Set message assertion
            (foodSaveRes.body.message).should.match('Title cannot be blank');

            // Handle food save error
            done(foodSaveErr);
          });
      });
  });

  it('should be able to update an food if signed in', function (done) {
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

        // Save a new food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Update food title
            food.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing food
            agent.put('/api/foods/' + foodSaveRes.body._id)
              .send(food)
              .expect(200)
              .end(function (foodUpdateErr, foodUpdateRes) {
                // Handle food update error
                if (foodUpdateErr) {
                  return done(foodUpdateErr);
                }

                // Set assertions
                (foodUpdateRes.body._id).should.equal(foodSaveRes.body._id);
                (foodUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of foods if not signed in', function (done) {
    // Create new food model instance
    var foodObj = new Food(food);

    // Save the food
    foodObj.save(function () {
      // Request foods
      request(app).get('/api/foods')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single food if not signed in', function (done) {
    // Create new food model instance
    var foodObj = new Food(food);

    // Save the food
    foodObj.save(function () {
      request(app).get('/api/foods/' + foodObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', food.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single food with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/foods/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Food is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single food which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent food
    request(app).get('/api/foods/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No food with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an food if signed in', function (done) {
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

        // Save a new food
        agent.post('/api/foods')
          .send(food)
          .expect(200)
          .end(function (foodSaveErr, foodSaveRes) {
            // Handle food save error
            if (foodSaveErr) {
              return done(foodSaveErr);
            }

            // Delete an existing food
            agent.delete('/api/foods/' + foodSaveRes.body._id)
              .send(food)
              .expect(200)
              .end(function (foodDeleteErr, foodDeleteRes) {
                // Handle food error error
                if (foodDeleteErr) {
                  return done(foodDeleteErr);
                }

                // Set assertions
                (foodDeleteRes.body._id).should.equal(foodSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an food if not signed in', function (done) {
    // Set food user
    food.user = user;

    // Create new food model instance
    var foodObj = new Food(food);

    // Save the food
    foodObj.save(function () {
      // Try deleting food
      request(app).delete('/api/foods/' + foodObj._id)
        .expect(403)
        .end(function (foodDeleteErr, foodDeleteRes) {
          // Set message assertion
          (foodDeleteRes.body.message).should.match('User is not authorized');

          // Handle food error error
          done(foodDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Food.remove().exec(done);
    });
  });
});
