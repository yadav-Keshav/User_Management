const crypto = require('crypto');

const createToken = () => {
    const token = `${Date.now()}${crypto.randomBytes(30).toString('hex')}`;
    return token;
}

module.exports = createToken;