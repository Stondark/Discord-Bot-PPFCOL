const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchRanking } = require('../../utils/fetch/fetchRanking');
const { embedPaginator, paginatorData } = require("../../utils/paginator")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('country_ranking')
        .setDescription('Top 10 de los paises con más pixeles diarios'),
    async execute(interaction) {
        const dailyCRanking = await fetchRanking();
        const pages = paginatorData(dailyCRanking.dailyCRanking, 10);
        const embeds = [];

        pages.forEach((page, index) => {
            const countryEmbed = new EmbedBuilder()
                .setTitle("Ranking países")
                .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
                .setDescription(`Países con el mayor número diario de pixeles (Página ${index + 1})`)
                .setFooter({ text: `Last updated: ${dailyCRanking.lastUpdated} Source: ${dailyCRanking.source}`, iconURL: 'https://i.imgur.com/MKEfQXJ.png' })
                .setColor("#E1FF00");
            // Agregar los campos correspondientes
            page.forEach((c, innerIndex) => {
                const fieldRow = { name: '\u200b', value: `**#${index * 10 + innerIndex + 1}** \u200b :flag_${c.cc.toLowerCase()}: \u200b ${c.px}`, inline: false };
                countryEmbed.addFields(fieldRow);
            });
            embeds.push(countryEmbed);
        });

        await embedPaginator(interaction, embeds);
    },
};