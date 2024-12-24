const { Message, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");

module.exports = new MessageCommand({
    command: {
        name: 'setwebhook',
        description: 'Set\'s the webhook url for the server.',
        aliases: [],
        permissions: PermissionFlagsBits.ManageWebhooks
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (args[0] === config.commands.webhook) {
            client.database.delete('webhook-' + message.guild.id);
        } else {
            client.database.set('webhook-' + message.guild.id, args[0]);
        }

        await message.reply({
            content: 'Successfully updated the webhook to \`' + args[0] + '\`.'
        });
    }
}).toJSON();