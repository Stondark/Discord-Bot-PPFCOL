require('dotenv').config();

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const cacheSetTTL = async (key, value, ttl = 3600) => {
    try {
        await myCache.set(key, value, ttl);
    } catch (error) {
        console.log(error)
    }  
};

// Return a JSON with info on cache if exist
const getCache = async (key) => {
    const data = await myCache.get(key);
    return (data == undefined) ? null : data;
}

module.exports = {
    cacheSetTTL,
    getCache
};