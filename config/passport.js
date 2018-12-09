const LocalStrategy = require ('passport-local').Strategy;
const User = require ('../modules/user');
const config = require ('../config/database');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');



var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
//opts.issuer = 'a.a.com';
//opts.audience = 'yoursite.net';

/*module.exports = function (passport) {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwtpayload);    
    User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
        return done(err, false);
    }
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
        // or you could create a new account
    }
});


}));

passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            user   : user
        });
    }

   req.login(user, {session: false}, (err) => {
       if (err) {
           res.send(err);
       }

       // generate a signed son web token with the contents of user object and return it in the response

       const token = jwt.sign(user, 'your_jwt_secret');
       return res.json({user, token});
    });
})(req, res);


};
*/

// jwt strategija
module.exports = function (passport) {
    //JWT strategija
    passport.use('jwt',new JwtStrategy(opts, function(jwt_payload, done) {
        console.log('JWT strategija');
        console.log({jwt_payload});    
        User.findOne({_id: jwt_payload._id}, function(err, user) {
            if (err) {
                 done(err, false);
            }
            if (user) {
                console.log({user});
                 done(null, user);
            } else {
                console.log('nema');
                 done(null, false);
                // or you could create a new account
            }
         });
    }));
    //Local strategy
    passport.use('local',new LocalStrategy(function(username, password, done){
        console.log('local strategija');
        let query= {username:{$regex: username, $options:'i'}};
        console.log({username,password});
        User.findOne(query, function(err,user){
            if(err) throw err;
            if(!user){
                return done(null,false,{message:'No user found!!'});
            }
            //Check password
            bcrypt.compare(password,user.password, function(err, isMatch){
                if (err) throw err;
                if(isMatch) {
                    //const token = jwt.sign(user, opts.secretOrKey);
                    //user.token = jwt.sign(user.toJSON(), opts.secretOrKey);
                    return done(null,user);
                } else {
                    return done(null,false,{message:'Wrong password'});
                }
            });
        });
    }));


    passport.serializeUser (function(id,done){
        done (null,id);
    });

    passport.deserializeUser(function(id,done) {
        User.findById(id, function(err, user) {
            done(err,user);
        });
    })
}
