const { Message, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");

module.exports = new MessageCommand({
    command: {
        name: 'setgame',
        description: 'Set the game to scan for workshop updates.',
        aliases: [],
        permissions: PermissionFlagsBits.ManageGuild
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
        if (!args[0]) {
            await message.reply({
                content: 'You must provide the app id!'
            });

            return;
        }

        if (args[0] === config.commands.appid) {
            client.database.delete('appid-' + message.guild.id);
        } else {
            client.database.set('appid-' + message.guild.id, args[0]);
        }

        await message.reply({
            content: 'Successfully updated the appid to \`' + args[0] + '\`.'
        });
    }
}).toJSON();