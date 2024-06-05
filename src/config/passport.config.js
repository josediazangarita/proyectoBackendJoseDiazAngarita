import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

<<<<<<< HEAD
import userModel from '../models/userModel.js';
import cartModel from '../models/cartModel.js';
=======
import userModel from '../dao/models/userModel.js';
import cartModel from '../dao/models/cartModel.js'; // Importa el modelo de carrito
>>>>>>> main
import { createHash, isValidPassword } from '../utils/functionUtils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de registro
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

                // Crear un nuevo carrito para el usuario
                const newCart = await cartModel.create({ products: [] });

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id // Asigna el ID del carrito recién creado
                };

                let result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    // Estrategia de inicio de sesión local
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                let user = await userModel.findOne({ email: username }).populate('cart');
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

    // Estrategia de inicio de sesión con GitHub
    passport.use(new GitHubStrategy({
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
                    // Crear un nuevo carrito para el usuario
                    const newCart = await cartModel.create({ products: [] });

                    const newUser = {
                        first_name: profile._json.name || profile.username || 'No first name',
                        last_name: 'No last name',
                        age: '18',
                        email: email,
                        password: createHash('defaultpassword'),
                        githubId: profile.id,
                        cart: newCart._id // Asigna el ID del carrito recién creado
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
        }
    ));

    // Serialización y deserialización
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            // Poblar el campo cart al deserializar el usuario
            let user = await userModel.findById(id).populate('cart');
            done(null, user);
        } catch (error) {
            done(error.message);
        }
    });
}

export default initializePassport;


