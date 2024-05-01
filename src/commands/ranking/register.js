const { SlashCommandBuilder } = require('discord.js');
const userSchema = require('../../db/schemas/users');
const { findOrUpdateDB } = require('../../db/utils');
const { encryptPassword } = require('../../utils/encrypt');
const { fetchMe } = require('../../utils/fetch/fetchMe');
const { fetchLogin } = require('../../utils/fetch/fetchLogin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registra tu cuenta en el bot para poder obtener estadísticas diarias, como pixeles diarios, etc')
        .addSubcommand(subcommand =>
            subcommand
                .setName('cookie')
                .setDescription('Registrar cuenta mediante cookie, use /tutorial')
                .addStringOption(option =>
                    option.setName('cookie')
                        .setDescription('Ingrese la cookie de la sesión actual')
                        .setRequired(true)
                        .setMinLength(60)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('account')
                .setDescription('Registrar cuenta mediante nombre de usuario y contraseña')
                .addStringOption(option =>
                    option.setName('username')
                        .setDescription('Ingrese el nombre de usuario o correo')
                        .setRequired(true)
                        .setMinLength(3)
                )
                .addStringOption(option =>
                    option.setName('password')
                        .setDescription('Ingrese la contraseña')
                        .setRequired(true)
                        .setMinLength(3)
                )),
    async execute(interaction) {

        let data = {};
        let filter = {};

        if (interaction.options.getSubcommand() === 'cookie') {
            data = {
                tag_discord: interaction.user.username,
                ppf_auth: 'cookie',
                ppf_cookie: `ppfun.session=${interaction.options.getString('cookie')}`
            };

            filter = {
                tag_discord: interaction.user.username,
                ppf_auth: 'cookie'
            };

        } else if (interaction.options.getSubcommand() === 'account') {
            data = {
                tag_discord: interaction.user.username,
                ppf_auth: 'account',
                ppf_user: `${interaction.options.getString('username')}`,
                ppf_pass: `${encryptPassword(interaction.options.getString('password'))}`
            }

            filter = {
                tag_discord: interaction.user.username,
                ppf_auth: 'account'
            };
        }

        try {
            if(interaction.options.getSubcommand() === 'cookie'){
                await fetchMe(data.ppf_cookie);
            }else if (interaction.options.getSubcommand() === 'account') {
                await fetchLogin(data);
            }
            await findOrUpdateDB(userSchema, data, filter);
            await interaction.reply({ content: 'Se registró correctamente el usuario!', ephemeral: true });
        } catch (error) {
            if(error.code == 'ERROR_LOGIN'){
                await interaction.reply({ content: error.message , ephemeral: true });
                return;
            }
            await interaction.reply({ content: 'Ocurrió un error desconocido, contacta a perriño!', ephemeral: true });            
        }
    },
};