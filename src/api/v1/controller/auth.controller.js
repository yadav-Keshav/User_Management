
const { Signup, verifyEmail, Login, ForgotPassword, ResetPassword, DeleteUser, Update, GetUser, GetVerificationLink, SearchUser } =
    require('../services/authService');

exports.signupUser = async (req, res, next) => {

    try {
        const data = await Signup(req.body, req.protocol, req.get("host"));
        return res.status(200).send(data);
    }
    catch (err) {
        return res.status(404).json({ sucess: false, message: err.message });
    }

}


exports.confirmEmail = async (req, res) => {
    try {
        const data = await verifyEmail(req.params.token);
        return res.send(data);

    }
    catch (err) {
        res.send({ message: err.message });
    }
}


exports.login = async (req, res) => {
    try {
        const data = await Login(req.body.email, req.body.password);
        if (data.sucess) {
            res.cookie('isLoggedIn', data.loginToken, { httpOnly: true });
            return res.send({ sucess: data.sucess, message: data.message, user: data.user });
        }
        else {
            return res.send(data);
        }

    }
    catch (err) {
        return res.status(404).send({ sucess: false, message: err.message });
    }
}

exports.logOut = async (req, res) => {
    res.cookie('isLoggedIn', " ", { maxAge: 1 });
    return res.json({ sucess: true, message: "Sucessfully Logout" });
}

exports.deleteUser = async (req, res) => {
    try {
        const data = await DeleteUser(req.params.id);
        return res.send(data);
    }
    catch (err) {
        return res.send({ sucess: false, message: err.message });
    }
}

exports.getVerificationLink = async (req, res) => {
    try {
        const data = await GetVerificationLink(req.body.email,req.protocol,req.get('host'));
        return res.send(data);
    }
    catch (err) {
        return res.status(404).send({ sucess: false, message: err.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const data = await ForgotPassword(req.body.email);
        if (data.sucess) {
            res.cookie('resetToken', data.resetToken, { httpOnly: true, maxAge: 1000 * 60 * 5 });
        }
        return res.send({ sucess: data.sucess, message: data.message });
    }
    catch (err) {
        return res.send({ message: err.message });
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const data = await ResetPassword(req.cookies.resetToken, req.body.otp, req.body.password);
        return res.send(data);
    }
    catch (err) {
        return res.send({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Update(req.body, id);
        res.send(data);
    }
    catch (err) {
        return res.send({ sucess: false, message: err.message });
    }
}



exports.getUser = async (req, res) => {
    try {
        const data = await GetUser(req.params.id, req.cookies.isLoggedIn);
        return res.send(data);
    }
    catch (err) {
        res.send({ sucess: false, message: err.message });
    }

}



exports.searchUsers = async (req, res) => {
    try {
        const queryStr = req.query.user;
        const data =await SearchUser(queryStr);
        return res.send(data);
    }
    catch (err) {
        res.send({ sucess: false, message: err.message });
    }

}