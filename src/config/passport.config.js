import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

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

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23liYUtwMJtBY1uSl7',
        clientSecret: '6d504591a2450ec2d42a38cda243cd815639c9a2',
        callbackURL: "http://localhost:8080/api/sessions/github/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                let email = profile._json.email || `${profile.username}@github.com`;
                let user = await userModel.findOne({ email });
                if (!user) {
                    const newUser = {
                        first_name: profile._json.name || profile.username || 'No first name',
                        last_name: 'No last name',
                        age: '18',
                        email: email,
                        password: createHash('defaultpassword'),
                        githubId: profile.id
                    };

                    let result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                console.error('Error obtaining access token:', error);
                return done(error);
            }
        }));

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


