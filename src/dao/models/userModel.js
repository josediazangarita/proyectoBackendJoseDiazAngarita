import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: { type: String, minLength: 3, required: true },
    last_name: { type: String, minLength: 3, required: true },
    email: { type: String, minLength: 5, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, minLength: 3, required: true },
    role: { type: String, required: false, default: 'user' }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;