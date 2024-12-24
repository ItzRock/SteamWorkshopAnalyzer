const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const os = require("os")
const moment = require("moment");
require("moment-duration-format");
function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

module.exports = new ApplicationCommand({
    command: {
        name: 'status',
        description: 'Provides information about the bot, including ping.',
        type: 1,
        options: []
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

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins]");
        const botUsed = formatBytes(process.memoryUsage().heapUsed)
        const total = formatBytes(os.totalmem())
        const usage = formatBytes(os.totalmem() - os.freemem())
        const percentage = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
        const message = await interaction.reply({content: "Pending..."})
        const curTime = new Date()
        const embed = new EmbedBuilder()
            .setAuthor({
                name: client.user.displayName,
                iconURL: client.user.avatarURL(),
            })
            .setTitle("Bot Stats")
            .addFields(
                { name: `System OS`, value: `\`${process.platform}\``, inline: true },
                { name: `System Memory Usage`, value: `\`${usage}/${total}\` \`(${percentage}%)\`\nBot Usage: \`${botUsed}\``, inline: true },
                { name: `Uptime`, value: `\`${duration}\``, inline: true },    
                { name: "Websocket Ping.", value: `\`${client.ws.ping}ms\``, inline: true },
                { name: "Real-Time Ping.", value: `\`${curTime - message.createdTimestamp}ms\``, inline: true }
            )
            .setColor("#00b0f4")
            .setFooter({
                text: client.user.displayName,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();
        await message.edit({embeds: [embed], content: ""});
    }
}).toJSON();