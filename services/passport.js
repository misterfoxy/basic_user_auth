const passport = require("passport");
const User = require("../models/user.js");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");


// create local strategy 
const localOptions = { usernameField: "email"};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // verify username and password, call done with user if info is correct
    // otherwise, call done with false

    User.findOne({ email: email }, function(err, user){
        if(err) { return done(err);}
        if(!user) { return done(null, false); }

        //compare passwords, is supplied password the same as user.password? Check the specs
        user.comparePassword(password, function(err, isMatch) {
            // if error, throw error
            if(err) { return done(err);}
            // if user is not found, return no user and false boolean
            if(!isMatch) { return done(null, false);}

            //if found, return user with req.user
            return done(null, user);
        });
    });
});


// set up options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// create JWT strategy (Payload is decoded JWT token)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    // See if the user ID in the payload exists in our database
    // if so, call 'done' with that user
    // else, call done without a user obj

    User.findById(payload.sub, function(err, user){
        if(err) { return done(err, false);}

        if(user) {
            done(null, user);

        }
        else {
            done(null, false);
        }
    });
});
// tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin);