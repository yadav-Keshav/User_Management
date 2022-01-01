
module.exports = (req, res, next) => {
    if (req.cookies.isLoggedIn) {
        next();
    }
    else {
        return res.send({ sucess: false, message: 'Please Log in first' });
    }
}