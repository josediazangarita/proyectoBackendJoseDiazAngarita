import userModel from '../models/userModel.js';

const UserService = {
    getUserByEmail: async (email) => {
        return userModel.findOne({ email });
    },
    createUser: async (userData) => {
        const newUser = new userModel(userData);
        return newUser.save();
    }
};

export default UserService;