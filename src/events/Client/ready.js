const { deployCommands, registerCommands } = require("../../handlers/commandHandler");
const { connectDB } = require("../../db/utils");
const fs = require('fs').promises;
const filePath = 'presence.json';

const readFilePresence = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Fail read file ${filePath}:`, error);
        throw error;
    }
};

module.exports = {
    name: "ready",
    once: true,
    async execute(interaction) {
        // Add all commands
        deployCommands(interaction);
        registerCommands();
        // Execute MongoDB 
        connectDB();
        const presenceStatus = await readFilePresence(filePath);
        // Change presence 
        setInterval(async () => {
            try {
                let randomStatus = Math.floor(Math.random() * presenceStatus.length);
                interaction.user.setActivity(presenceStatus[randomStatus]);
            } catch (error) {
                console.error("Error while changing presence:", error);
            }
        }, 10000);
    }
}