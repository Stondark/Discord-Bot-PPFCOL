const MONGOURL = process.env.MONGO_URL;
const mongoose = require('mongoose');

const connectDB = async () => {
    if (!MONGOURL) return;

    await mongoose.connect(MONGOURL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);

            // Handle specific error conditions
            if (error.name === 'MongoNetworkError') {
                console.error('Network error occurred. Check your MongoDB server.');
            } else if (error.name === 'MongooseServerSelectionError') {
                console.error('Server selection error. Ensure'
                    + ' MongoDB is running and accessible.');
            } else {
                // Handle other types of errors
                console.error('An unexpected error occurred:', error);
            }
        });

    // Handling connection events
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

    db.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
};
const findDB = async (model, filter, options = {}) => {
    try {
        let query = model.find(filter);
        // Si se proporciona el parámetro de ordenamiento, lo aplicamos
        if (options.sort) {
            query = query.sort(options.sort);
        }

        const documents = await query.exec();
        return documents;
    } catch (error) {
        console.error('Error al buscar documentos:', error);
        throw error;
    }
};


const findByFilterDB = async (model, filter) => {
    try {
        const documents = await model.findOne(filter);
        return documents;
    } catch (error) {
        console.error('Error al buscar documentos:', error);
        throw error;
    }
};

const insertDB = async (model, data) => {
    try {
        const result = await model.create(data);
        return result;
    } catch (error) {
        console.log('Error en la operación:', error);
        throw error;
    }
};

const findOrUpdateDB = async (model, data, filter) => {
    try {
        const result = await model.findOneAndUpdate(
            filter, // Criterio de búsqueda
            data, // Datos a insertar o actualizar
            { upsert: true, new: true }
        );
        return result;
    } catch (error) {
        console.log('Error en la operación:', error);
        throw error;
    }
}

const updateOneDB = async (model, filter, data) => {
    try {
        const result = await model.updateOne(
            filter, // Criterio de búsqueda
            data, // Datos a insertar o actualizar
        );
        if (result.matchedCount === 0) {
            throw new Error('No se encontró ningún documento para actualizar.');
        }
        return result;
    } catch (error) {
        console.log('Error en la operación:', error);
        throw error;
    }
}



module.exports = {
    connectDB,
    findDB,
    insertDB,
    findOrUpdateDB,
    findByFilterDB,
    updateOneDB
}