const fs = require('node:fs');
const path = require('node:path');

const registerEvents = (client) => {
    const foldersPath = path.join(__dirname, '..', 'events');
    const eventFolders = fs.readdirSync(foldersPath);

    // Read all folders in events path
    for (const folder of eventFolders) {
        const eventsPath = path.join(foldersPath, folder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.rest) {
                if (!event.once) {
                    client.rest.on(event.name, (...args) => event.execute(...args, client));
                    continue;
                }

                client.rest.once(event.name, (...args) => event.execute(...args, client));
                continue;
            }

            if (!event.once) {
                client.on(event.name, (...args) => event.execute(...args, client));
                continue;
            }

            client.once(event.name, (...args) => event.execute(...args, client));
        }
    }
};

module.exports = {
    registerEvents
}