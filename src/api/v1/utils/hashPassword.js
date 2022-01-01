const bcrypt=require('bcrypt');

exports.hashPassword=async (password)=>{
    let salt = await bcrypt.genSalt();
    return await bcrypt.hash(password ,salt);
}

exports.comparePassword=async(password,dbPassword)=>{
       return await bcrypt.compare(password, dbPassword);
}