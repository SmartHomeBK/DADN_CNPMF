import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    //this is a referrence to this user document.
    if (!this.isModified('password')) {
        // check if the password has been modified or not.
        next(); // navigate to the next middleware or save document to database.
    }
    //10 is saltrounds mean that the numebr of iterations of the hashing algorithm
    // có thể dùng bcrypt.hashSync nếu không dùng async/await nha
    this.password = await bcrypt.hash(this.password, 10);
    console.log('hashed password: ', this.password);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(
        'bạn đang vào compare password! @@@65 and hashed password: ',
        enteredPassword,
        this.password
    );
    //this.password refer to the hashed password.
    return await bcrypt.compare(enteredPassword, this.password);
    //return promise that resolve to true if the passwords match and false if they dont match.
};

UserSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.COOKIE_EXPIRES * 24 * 60 * 60,
    });
};
const User = mongoose.model('User', UserSchema);
export default User;
