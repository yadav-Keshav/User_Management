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
    firstName: {
        type: String,
        required: [true, "FirsrName cannot empty"]
    },
    lastName: {
        type: String,
        required: [true, "LastName cannot be empty"]
    },
    bio: {
        type: String,
        trim: true,
    },
    accountType: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
    website: {
        type: String,
    },
    gender: {
        type: String,
        select: false,
    },
    birthday: {
        type: Date,
        select: false,
    },
    friend: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    pendingRequest: {
        type: [mongoose.Schema.Types.ObjectId]
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