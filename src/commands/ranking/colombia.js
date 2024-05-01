const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedPaginator, paginatorData } = require("../../utils/paginator");
const { updateRanking, getRanking } = require('../../utils/updateRanking');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('colombia_ranking')
        .setDescription('Top 10 de los paises con más pixeles diarios')
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('Registrar cuenta mediante cookie, use /tutorial'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('total')
                .setDescription('Registrar cuenta mediante nombre de usuario y contraseña')
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const colombiaRanking = await getRanking();
            const embeds = [];
            let pages = [];
            let dataRanking = [];
            let subcommand = interaction.options.getSubcommand();
            let description = '';

            if (subcommand === 'daily') {
                dataRanking = colombiaRanking
                    .sort((a, b) => b.daily_pixels - a.daily_pixels);
                description = 'Colombianos con el mayor número diario de pixeles';
            } else if (subcommand === 'total') {
                dataRanking = colombiaRanking.sort((a, b) => b.total_pixels - a.total_pixels);
                description = 'Colombianos con el mayor número de pixeles';
            }

            pages = paginatorData(dataRanking, 10);

            pages.forEach((page, index) => {
                const colombianEmbed = new EmbedBuilder()
                    .setTitle("Ranking Colombia")
                    .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
                    .setDescription(`${description} (Página ${index + 1})`)
                    .setFooter({ text: `Last updated: ${dataRanking.lastUpdated} Source: ${dataRanking.source}`, iconURL: 'https://i.imgur.com/MKEfQXJ.png' })
                    .setColor("#E1FF00");
                // Agregar los campos correspondientes
                page.forEach((c, innerIndex) => {
                    let pixelsTemp = (subcommand == 'daily') ? parseInt(c.daily_pixels).toLocaleString() : parseInt(c.total_pixels).toLocaleString();
                    if (pixelsTemp == 0) {
                        return;
                    }
                    const fieldRow = { name: '\u200b', value: `**#${index * 10 + innerIndex + 1}** \u200b ${c.tag_discord} - ${(pixelsTemp)}`, inline: false };
                    colombianEmbed.addFields(fieldRow);
                });
                embeds.push(colombianEmbed);
            });
            await embedPaginator(interaction, embeds, { previewDefer: true });
        } catch (error) {
            console.log("hi", error);
        }

    },
};