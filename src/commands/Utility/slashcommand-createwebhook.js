const { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const os = require("os")
const moment = require("moment");
require("moment-duration-format");
function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

module.exports = new ApplicationCommand({
    command: {
        name: 'createwebhook',
        description: 'Creates a webhook.',
        type: 1,
        options: [{
                    name: "channel",
                    description: "The channel you'd like to create the webhook in.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }],
        permissions: PermissionFlagsBits.ManageWebhooks
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel", true)
        const webhookURL = await channel.createWebhook({})
        client.database.set('webhook-' + message.guild.id, webhookURL);
        interaction.reply("Successfully created webhook.")
    }
}).toJSON();