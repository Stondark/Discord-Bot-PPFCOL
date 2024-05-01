const axios = require("axios");
const { cacheSetTTL, getCache } = require('../cacheUtils');

require('dotenv').config();

const fetchRanking = async () => {
    try {
        let isCached = await getCache('ranking');
        if (isCached != null) {
            isCached.source = "caché";
            return isCached;
        }
        // Fetch api
        const response = await axios.get(`${process.env.BASE_URL}/ranking`);

        // Add new info properties
        let data = response.data;
        data.lastUpdated = new Date().toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        data.source = "fetch";
        // Cache the data - 5 min
        await cacheSetTTL('ranking', data, 300);
        return data;
    } catch (error) {
        console.error('Error fetching ranking:', error);
        throw error;
    }
};


module.exports = {
    fetchRanking
};
