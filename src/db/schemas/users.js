const { model, Schema } = require('mongoose');

// Define el schema del usuario
const userSchema = new Schema({
    tag_discord: String,
    ppf_auth: {
        type: String,
        enum: ['account', 'cookie'],
        required: true
    },
    ppf_user: {
        type: String,
        required: function () {
            return this.ppf_auth === 'account'; // Este campo es requerido solo si ppf_auth es 'account'
        }
    },
    ppf_pass: {
        type: String,
        required: function () {
            return this.ppf_auth === 'account'; // Este campo es requerido solo si ppf_auth es 'account'
        }
    },
    ppf_cookie: {
        type: String,
    },
    daily_pixels: {
        type: String
    },
    total_pixels: {
        type: String
    }
});

// Compilar el schema en un modelo
const User = model('User', userSchema, 'users');

module.exports = User;
