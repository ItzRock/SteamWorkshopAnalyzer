require('dotenv').config();
const fs = require('fs');
const DiscordBot = require('./client/DiscordBot');

async function run() {
    fs.writeFileSync('./terminal.log', '', 'utf-8');
    const client = new DiscordBot();

    client.steam = undefined;

    module.exports = client;

    client.connect();

    process.on('unhandledRejection', console.error);
    process.on('uncaughtException', console.error);
}
run()