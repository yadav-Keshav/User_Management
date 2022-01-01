
const express = require('express');
const { signupUser, confirmEmail, login, forgotPassword, resetPassword, logOut, deleteUser, update, getUser, getVerificationLink,searchUsers } = require('../controller/auth.controller');
const isAuthorised = require("../middleware/isAuthorised");

const authRouter = express.Router();


authRouter.post('/signup', signupUser);
authRouter.get('/confirm_email/:token', confirmEmail);
authRouter.post('/login', login);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post("/resetpassword", resetPassword);
authRouter.get("/logout", isAuthorised, logOut);
authRouter.get("/delete/:id", isAuthorised, deleteUser);
authRouter.put("/update/:id", isAuthorised, update);
authRouter.get('/:id', isAuthorised, getUser);
authRouter.post("/get_email_verification_link",getVerificationLink);
authRouter.post("/search",searchUsers)
module.exports = authRouter;