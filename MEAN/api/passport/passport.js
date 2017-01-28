var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    //Set email as username with usernameField property
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password incorrect
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect Password'
        });
      }
      // Return if email and password are correct
      return done(null, user);
    });
  }
));