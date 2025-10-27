import mongoose from '../config/DBHelpler';

const UserSchema = new mongoose.Schema({
    username: { type: String },
    name: { type: String },
    password: { type: String }
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
