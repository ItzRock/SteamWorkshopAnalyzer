const { ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const os = require("os")
const moment = require("moment");
require("moment-duration-format");
function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

module.exports = new ApplicationCommand({
    command: {
        name: 'analyze',
        description: 'Scan a Steam Workshop Package',
        type: 1,
        options: [{
            name: "workshopurl",
            description: "The complete workshop url of the package you'd like to scan.",
            type: ApplicationCommandOptionType.String,
            required: true
        }]
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
        const message = await interaction.reply({content: "Not implemented yet.", ephemeral: true})
    }
}).toJSON();