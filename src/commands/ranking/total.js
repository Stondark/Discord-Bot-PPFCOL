const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchRanking } = require('../../utils/fetch/fetchRanking');
const { embedPaginator, paginatorData } = require("../../utils/paginator")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('total_ranking')
        .setDescription('Personas con el mayor número de pixeles en PPF'),
    async execute(interaction) {
        const dailyCRanking = await fetchRanking();
        const pages = paginatorData(dailyCRanking.ranking, 10);
        const embeds = [];

        pages.forEach((page, index) => {
            const countryEmbed = new EmbedBuilder()
                .setTitle("Ranking total")
                .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
                .setDescription(`Personas con el mayor número de pixeles (Página ${index + 1})`)
                .setFooter({ text: `Last updated: ${dailyCRanking.lastUpdated} Source: ${dailyCRanking.source}`, iconURL: 'https://i.imgur.com/MKEfQXJ.png' })
                .setColor("#E1FF00");
            // Agregar los campos correspondientes
            page.forEach((c, innerIndex) => {
                const fieldRow = { name: '\u200b', value: `**#${index * 10 + innerIndex + 1}** \u200b ${c.name} \u200b *-* ${c.t}`, inline: false };
                countryEmbed.addFields(fieldRow);
            });
            embeds.push(countryEmbed);
        });

        await embedPaginator(interaction, embeds);
    },
};