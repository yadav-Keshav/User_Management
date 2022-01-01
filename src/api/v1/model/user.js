const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Username cannot be Empty']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        require: [true, 'Username cannot be Empty'],
        validate: [isEmail, "Invalid Email"],
    },
    password: {
        type: String,
        minlength: [8, 'Password must be Greater than 8 letters'],
        required: [true, 'Password cannot be empty'],
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    token: String,
}, { timestamps: true });




// Function to verify Email
userSchema.methods.confirmEmailHandler = function () {
    this.verified = true;
    this.token = undefined;
}

// Function to set new password
userSchema.methods.resetPasswordHandler = function (password, ConfirmPassword) {
    this.password = password;
    this.token = undefined;
}


module.exports = mongoose.model('userModel', userSchema);