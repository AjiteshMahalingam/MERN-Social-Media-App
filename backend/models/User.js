const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Email is invalid');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 100
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: Buffer
    },
    coverPicture: {
        type: Buffer
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String
        }
    }]
}, {
    timestamps: true
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

const User = mongoose.model("user", UserSchema);
User.createIndexes();

module.exports = User;