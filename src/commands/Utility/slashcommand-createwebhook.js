const { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
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