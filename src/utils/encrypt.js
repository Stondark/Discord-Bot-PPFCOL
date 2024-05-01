const crypto = require('crypto');
const secureKey = process.env.SECURE_KEY;



const encryptPassword = (password) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secureKey, Buffer.alloc(16));
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');
    return encryptedPassword;
};

const decryptPassword = (encryptedPassword) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secureKey, Buffer.alloc(16));
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
};


module.exports = {
    encryptPassword,
    decryptPassword
};