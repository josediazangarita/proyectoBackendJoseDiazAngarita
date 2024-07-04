import bcrypt from 'bcrypt';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
export const isValidPassword = (user, password) => {
    if (!user) {
        console.error('User is required');
        throw new Error('User is required');
    }
    if (!user.password) {
        console.error('User password is required');
        throw new Error('User password is required');
    }
    if (!password) {
        console.error('Password is required');
        throw new Error('Password is required');
    }
    return bcrypt.compareSync(password, user.password);
};

