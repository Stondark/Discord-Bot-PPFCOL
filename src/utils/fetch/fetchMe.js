const axios = require("axios");

const fetchMe = async (cookie) => {
    try {

        if (!cookie) {
            throw Object.assign(new Error('El valor de la cookie está vacío'), { code: 'EMPTY_COOKIE' });
        }
        const cookieHeader = {
            headers: {
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }
        const response = await axios.get(`${process.env.BASE_URL}/api/me`, cookieHeader);
        // Add new info properties
        let data = response.data;
        if (data.id == 0) {
            throw Object.assign(new Error('Ocurrió un error al obtener la información, actualice la cookie'), { code: 'ERROR_LOGIN' });
        }

        return data;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    fetchMe
};
