import passport from 'passport';
import local from 'passport-local';

import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('User already exists');
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };

                let result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                let user = await userModel.findOne({ email: username });
                if (!user) {
                    return done(new Error('User not found'), false);
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error.message);
        }
    });
}
export default initializePassport;
