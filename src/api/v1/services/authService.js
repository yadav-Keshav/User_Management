const userModel = require('../model/user');
const Profile = require('../model/profile');
const createToken = require('../utils/createToken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const confirmEmailTemplate = require('../template/confirmEmail.template');
const forgotPasswordTemplate = require('../template/forgotPassword.template');
const jwt = require('jsonwebtoken');
const { KEY } = require('../config/env');
const axios = require('axios')



exports.Signup = async (data, protocol, host) => {
    var user = await userModel.findOne({ $or: [{ username: data.username }, { email: data.email },] });
    if (user) {
        return { sucess: false, message: (user.email == data.email) ? 'Email already Exist' : 'Username already Exist' };
    }
    else {
        data.token = Date.now()+createToken();
        data.password = await hashPassword(data.password);
        let link = `${protocol}://${host}/users/confirm_email/${data.token}`;
        let html = confirmEmailTemplate(data.username, link);
        var user = await userModel.create(data);
        await axios.post('https://email-sevice.herokuapp.com/', { email: data.email, html: html, subject: 'Link for confirm Email' });
        return { sucess: true, message: 'Sucessfully Registered' };
    }
}



exports.verifyEmail = async (token) => {
    var user = await userModel.find({ token: token });
    if (!user || user.length != 1) {
        return { sucess: false, message: 'Invalid token' }
    }
    user = user[0];
    await user.confirmEmailHandler();
    await user.save();
    return { sucess: true, message: 'Email verified' };
}



exports.Login = async (email, password) => {
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return { sucess: false, message: "User not fount" };
    }
    if (await comparePassword(password, user.password)) {
        if (user.verified) {
            const jwtToken = jwt.sign({ _id: user._id }, KEY);
            return {
                sucess: true, loginToken: jwtToken, user: { _id: user._id, username: user.username }, message: "Sucessfully logged In"
            };
        }
        else {
            return { sucess: false, message: "Email not verified" };
        }
    }
    else {
        return { sucess: false, message: 'Wrong Credential' };
    }
}


exports.GetVerificationLink = async (email, protocol, host) => {
    const token = createToken();
    const user = await userModel.findOneAndUpdate({ email: email }, { token: token });
    if (user) {
        let link = `${protocol}://${host}/users/confirm_email/${token}`;
        let html = confirmEmailTemplate(user.username, link);
        await axios.post('https://email-sevice.herokuapp.com/', { email: user.email, html: html, subject: 'Link for confirm Email' });
        return { sucess: true, message: 'Link Sent' };
    }
    else {
        return { sucess: false, message: 'Email is not registered' };
    }
}

exports.ForgotPassword = async (email) => {
    const user = await userModel.findOne({ email: email });
    if (user && user.verified) {
        const OTP = Math.floor(Math.random() * 1000000 + 1);
        var html = forgotPasswordTemplate(" ", OTP);
        user.token = OTP;
        await user.save();
        await axios.post('https://email-sevice.herokuapp.com/', { email: email, html: html, subject: 'OTP for Reset Password' });
        const jwtToken = jwt.sign({ _id: user._id }, KEY);
        return { sucess: true, message: 'OTP send', resetToken: jwtToken };
    }
    else {
        return { sucess: false, message: 'User not Found' };
    }
}


exports.ResetPassword = async (resetToken, otp, password) => {
    const payload = jwt.verify(resetToken, KEY);
    const user = await userModel.findOne({ _id: payload._id });
    if (user) {
        if (user.token != otp) {
            return { sucess: false, message: 'Wrong Otp' };
        }
        let hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.token = undefined;
        await user.save();
        return { sucess: true, message: "Password Reseted" };
    }
    else {
        return { sucess: false, message: 'User not Found' };
    }
}


exports.Update = async (data, id) => {
    const user = await Profile.findOneAndUpdate({ user: id }, data);
    if (user) {
        return { sucess: true, message: 'Sucessfully Updated' };
    }
    else {
        return { sucess: false, message: 'User not Found' }
    }
}

exports.DeleteUser = async (id) => {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
        await Profile.findOneAndDelete({ user: user._id })
        return { sucess: true, message: 'Account Deleted' };
    }
    else {
        return { sucess: false, message: 'User not Found' }
    }
}

exports.GetUser = async (id, loginToken) => {
    const user = await Profile.findOne({ user: id });
    const payload = jwt.verify(loginToken, KEY);
    if (user) {
        if (payload._id == id) {
            return { sucess: true, user: user }
        }
        else {
            return { sucess: true, user: { name: user.name, bio: user.bio, website: user.website, gender: user.gender } };
        }
    }
    else {
        return { sucess: false, message: 'User not Found' };
    }
}


exports.SearchUser = async (queryStr) => {
    const users = await userModel.find({
        $or: [{ "username": { $regex: queryStr, $options: 'i' } },
        { "email": { $regex: queryStr, $options: 'i' } }]
    }, null, { limit: 100 });
    return users;

}