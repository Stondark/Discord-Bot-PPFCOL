const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { findByFilterDB } = require('../../db/utils');
const { fetchMe } = require('../../utils/fetch/fetchMe');
const { fetchLogin } = require('../../utils/fetch/fetchLogin');
const { embedPaginator } = require("../../utils/paginator")
const userSchema = require('../../db/schemas/users');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Información del usuario dentro de PPF')
        .addUserOption(option => option.setName('target').setDescription('El usuario')),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('target');
            const attachment = new AttachmentBuilder('https://i.imgur.com/wf1T3T6.png');
            let filter = {};
            let userId;

            filter = (user) ? { tag_discord: user.username } : { tag_discord: interaction.user.username };
            userId = (user) ? user.id : interaction.user.id;
            let userInfo = await findByFilterDB(userSchema, filter);
            if (!userInfo) {
                await interaction.reply("No se encontró información, por favor regístrate con **/register**");
            }

            let data;
            let embeds = [];

            if (userInfo.ppf_auth == 'cookie') {
                data = await fetchMe(userInfo.ppf_cookie);
            } else if (userInfo.ppf_auth == 'account') {
                data = await fetchLogin(userInfo);
            }

            if (!data) {
                await interaction.reply("Ocurrió un error al intentar obtener la información actual");
                return;
            }

            if (data.dailyTotalPixels <= 100) {
                interaction.channel.send({ content: `Póngase a pixeltrabajar! <@${userId}>.`, files: [attachment] })
            }

            const userEmbed = new EmbedBuilder()
                .setTitle(`Información del usuario ${data.name} `)
                .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
                .addFields(
                    { name: 'Nombre', value: `${data.name}`, inline: false },
                    { name: 'Pixeles totales', value: `${data.totalPixels.toLocaleString()}`, inline: false },
                    { name: 'Pixeles diarios', value: `${data.dailyTotalPixels.toLocaleString()}`, inline: false },
                    { name: 'Ranking', value: `${data.ranking.toLocaleString()}`, inline: false },
                    { name: 'Ranking diario', value: `${data.dailyRanking.toLocaleString()}`, inline: false })
                .setFooter({ text: `\u200b`, iconURL: 'https://i.imgur.com/MKEfQXJ.png' })
                .setColor("#E1FF00");
            embeds.push(userEmbed);
            await embedPaginator(interaction, embeds, { previewDefer: true });
        } catch (error) {
            console.log(error)
        }
    },
};