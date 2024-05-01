require('dotenv').config()

// Require the necessary discord.js classes
const { Client, Events } = require('discord.js');
const { registerEvents } = require("./src/handlers/eventHandler");

// Create a new client instance
const client = new Client({ intents: 36575 });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).then(() => {
    registerEvents(client); // 
}).catch((error) => {
    console.error('Error al iniciar sesión:', error);
    process.exit(1);
});