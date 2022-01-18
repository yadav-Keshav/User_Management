const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required:[true,"Name cannot be empty"]
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
        name: {
            type: String,
        },
        gender: {
            type: String,
            select: false,
        },
        birthday: {
            type: Date,
            select: false,
        }
    }, { timestamps: true }
);


const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;