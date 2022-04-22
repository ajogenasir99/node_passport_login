const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const encrypt = require('bcryptjs');

// Load User Module
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, async (email,password, done) => {
            // Match User
            foundUser = await User.findOne({email: email});
            try {
                if (!foundUser) {
                    return done(null,false, {message: 'That email is not registered'});
                }
            // Match password
            encrypt.compare(password, foundUser.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, foundUser);
                } else {
                    return done(null, false, {message: 'Password incorrect'});
                }
            });

            } catch (error) {
                console.log(error);
            }
        })
    );
    
    passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });

};
