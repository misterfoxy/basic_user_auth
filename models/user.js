const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our user model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase:true},
    password: String,
    name: String
});

// on save hook, encrypt password
// before saving model, execute function
userSchema.pre('save', function(next){
    const user = this;
    
    //generate a salt, and run callback
    bcrypt.genSalt(10, function(err, salt){
        if(err) { return next(err); }

        //hash(encrypt) password with salt
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) { return next(err);}
          
            //overwrite plain text password with encrypted password
            user.password = hash;
            
            // execute save hook
            next();
        });
    });
});

//create the user model class

const User = mongoose.model('user', userSchema);

//export the usermodel
module.exports = User;
