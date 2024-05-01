const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bhurra')
        .setDescription('Mamaburra.')
        .addStringOption(option => {
            return option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        }),
    async execute(interaction) {
        console.log("user command executes");
        await interaction.reply(`burra burra burra burra burra`);
    },
};