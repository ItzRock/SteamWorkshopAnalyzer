const { Message, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");

module.exports = new MessageCommand({
    command: {
        name: 'createwebhook',
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
        const channel = message.guild.channels.cache.get(args[0])
        if(channel != undefined){
            const webhook = await channel.createWebhook({ name: client.user.displayName, avatar: client.user.avatarURL() })
            client.database.set('webhook-' + message.guild.id, webhook.url);
            message.reply(`Created webhook for <#${args[0]}>!`)
        } else {
            message.reply("Couldn't find channel.")
        }
    }
}).toJSON();