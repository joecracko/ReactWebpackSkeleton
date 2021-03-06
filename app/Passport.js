// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validPassword(password, passhash) {
    return bcrypt.compareSync(password, passhash);
};

// expose this function to our app using module.exports
module.exports = function(passport, models) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        models.User.findById(id).then(function(user) {
            var err = null;
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        console.log("Username: " + username)
        console.log("Password: " + password)

        // asynchronous
        // User.findOne wont fire unless data is sent back
/*        process.nextTick(function() {*/
            models.User.findOrCreate({
                where: {
                    username: username
                },
                defaults:{
                    username: username,
                    passhash: generateHash(password)
                }
            }).then(function(user, created){
                var created = user[1];
                if(created){
                    return done(null, user);
                } else{
                    return done(null, user, "User Already Exists");
                }
            }).error(function(err){
                return done(err);
            });

            /*
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();
                    // set the user's local credentials
                    newUser.local.username    = username;
                    newUser.local.password = newUser.generateHash(password);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });  
            */  

/*        });*/

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        console.log("Username: " + username)
        console.log("Password: " + password)

        username = username.toLowerCase();

        models.User.findOne({
            where: {
                "username" : username
            }
        }).then(function(user){
            if(!user){
                return done(null, null, "User does not exist");
            }

            console.log(user.passhash)
            if(!validPassword(password, user.passhash)){
                return done(null, null, "Password incorrect");
            }

            return done(null, user);
        }).error(function(err){
            return done(err);
        });

/*        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                return done(err);
            }

            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
                

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            user.loginSuccess = true;
            return done(null, user);
        });*/

    }));

};