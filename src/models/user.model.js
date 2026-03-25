import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, default: false, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true }
})

// Asociados a la colecccion "users"
const UserModel = mongoose.model("User", userShema);

export default UserModel;