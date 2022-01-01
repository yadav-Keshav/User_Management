const userModel = require('../model/user');


exports.getUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        if (user) {
            res.send({ sucess: true, data: user });
        }
        else{
            res.send({sucess:false,message:'User not Found'});
        }
    }
    catch (err) {
        res.send({ sucess: false, message: err.message });
    }

}