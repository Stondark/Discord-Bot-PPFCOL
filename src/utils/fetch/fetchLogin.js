const axios = require("axios");
const { decryptPassword } = require("../../utils/encrypt");

const fetchLogin = async (accountInfo) => {
    try {

        let dataBody = {
            nameoremail: accountInfo.ppf_user,
            password: decryptPassword(accountInfo.ppf_pass)
        };

        // Fetch api
        const response = await axios.post(`${process.env.BASE_URL}/api/auth/local`, dataBody);
        let data = response.data;
        return data.me;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw Object.assign(new Error('Ocurrió un error al obtener la información, valide los usuarios'), { code: 'ERROR_LOGIN' });
        } else {
            throw error;
        }
    }
};


module.exports = {
    fetchLogin
};
