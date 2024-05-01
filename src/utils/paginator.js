const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

const embedPaginator = async (interaction, pages, { time = 30 * 1000, previewDefer = false } = {}) => {
    try {
        if (!interaction || !pages || !pages > 0) {
            throw new Error("Invalid args");
        }

        if (!previewDefer) {
            await interaction.deferReply();
        }



        if (pages.length === 1) {
            return await interaction.editReply({ embeds: pages, component: [], fetchReply: true });
        }

        let index = 0;

        const firstButton = new ButtonBuilder().setCustomId('firstPage').setEmoji('⏮️').setStyle(ButtonStyle.Primary).setDisabled(true);
        const prevButton = new ButtonBuilder().setCustomId('prevPage').setEmoji('⬅️').setStyle(ButtonStyle.Primary).setDisabled(true);
        const countPage = new ButtonBuilder().setCustomId('countPage').setLabel(`${index + 1}/${pages.length}`).setStyle(ButtonStyle.Primary).setDisabled(true);
        const nextPage = new ButtonBuilder().setCustomId('nextPage').setEmoji('➡️').setStyle(ButtonStyle.Primary);
        const lastPage = new ButtonBuilder().setCustomId('lastPage').setEmoji('⏭️').setStyle(ButtonStyle.Primary);
        const buttons = new ActionRowBuilder().addComponents([firstButton, prevButton, countPage, nextPage, lastPage]);

        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });
        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({ content: "No puedes cambiar la página de alguien más", ephemeral: true });

            await i.deferUpdate();
            switch (i.customId) {
                case 'firstPage':
                    index = 0;
                    break;
                case 'prevPage':
                    if (index > 0) index--;
                    break;
                case 'nextPage':
                    if (index < pages.length - 1) index++;
                    break;
                case 'lastPage':
                    index = pages.length - 1;
                    break;
            }
            countPage.setLabel(`${index + 1}/${pages.length}`);

            if (index === 0) {
                firstButton.setDisabled(true);
                prevButton.setDisabled(true);
            } else {
                firstButton.setDisabled(false);
                prevButton.setDisabled(false);
            }

            if (index === pages.length - 1) {
                nextPage.setDisabled(true);
                lastPage.setDisabled(true);
            } else {
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
            }

            await msg.edit({ embeds: [pages[index]], components: [buttons] });
            collector.resetTimer();
        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [pages[index]], components: [] }).catch(err => { console.log('eerrorrr') });
        });
        return msg;

    } catch (error) {
        console.log(error)
    }
};

const paginatorData = (data, pageSize) => {
    const pages = [];
    for (let i = 0; i < data.length; i += pageSize) {
        pages.push(data.slice(i, i + pageSize));
    }
    return pages;
};


module.exports = {
    embedPaginator,
    paginatorData
}