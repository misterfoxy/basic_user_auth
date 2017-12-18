const User = require('../models/user.js');

exports.signup = function(req, res, next){
    //see if user with given email exists
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if(!email || !password){
        return res.status(422).send({ error: 'You must provide an email and password!'});
    }
  
    User.findOne({ email: email}, function(err, existingUser) {
        if(err){ return next(err);}

          //if email exists, return error
          if(existingUser){
              return res.status(422).send({ error: 'Email is in use'});
          }

          // if email !exists, create and save record
          const user = new User({
              email: email,
              password: password,
              name: name
          });

          user.save(function(err){
            if(err){ return next(err);}
          });

          res.json({success:true});
    });
    

    //respond to request indicating that user was created
};