const userSchema = require('../db/schemas/users');
const { findDB, updateOneDB } = require('../db/utils');
const { cacheSetTTL, getCache } = require('../utils/cacheUtils');
const { fetchMe } = require('../utils/fetch/fetchMe');
const { fetchLogin } = require('../utils/fetch/fetchLogin');

const updateRanking = async () => {
    try {
        let data = await findDB(userSchema);
        let userDataPromises = []; // Array para almacenar las promesas

        // Iterar sobre los elementos y almacenar las promesas en el array
        data.forEach(element => {
            let userDataPromise = (async () => {
                try {
                    let userData;
                    if (element.ppf_auth == 'cookie') {
                        userData = await fetchMe(element.ppf_cookie);
                    } else {
                        userData = await fetchLogin(element);
                    }
                    await updateOneDB(userSchema, { tag_discord: element.tag_discord }, { daily_pixels: userData.dailyTotalPixels, total_pixels: userData.totalPixels });
                } catch (error) {
                    console.error(`Error processing user ${element.tag_discord}:`, error);
                }
            })();
            userDataPromises.push(userDataPromise); // Agregar la promesa al array
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(userDataPromises);

        // Después de que todas las promesas se hayan resuelto, continuar con el resto del código
        let dataUpdated = await findDB(userSchema);
        dataUpdated.source = 'fetch';
        dataUpdated.lastUpdated = new Date().toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        await cacheSetTTL('colombia_ranking', dataUpdated, 300);
        return dataUpdated;
    } catch (error) {
        console.log('error in update Ranking', error)
    }
};

const getRanking = async () => {
    let isCached = await getCache('colombia_ranking');
    if (isCached != null) {
        isCached.source = "caché";
        return isCached;
    }
    let data = await updateRanking();
    return data;
};


module.exports = {
    updateRanking,
    getRanking
};