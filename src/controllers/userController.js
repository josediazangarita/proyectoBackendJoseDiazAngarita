import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';

const UserController = {
    registerUser: async (req, res) => {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            });
            await newUser.save();
            res.redirect('/login');
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).send('Error registering user');
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user || !isValidPassword(user, password)) {
                return res.status(401).send('Invalid email or password');
            }
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            };
            res.redirect('/products');
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).send('Error logging in user');
        }
    },
    logoutUser: async (req, res) => {
        req.logout();
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    },
    restorePassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).send("User not found with that email.");
            }
            user.password = createHash(newPassword);
            await user.save();
            return res.redirect('/login');
        } catch (error) {
            console.error('Error restoring password:', error);
            res.status(500).send('Error restoring password');
        }
    }
};

export default UserController;