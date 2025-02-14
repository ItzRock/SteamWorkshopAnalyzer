const { ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const downloadWorkshopItem = require("../../utils/SteamCMD")
require("moment-duration-format");
const zip = require("../../utils/zip")
const fs = require("fs")
module.exports = new ApplicationCommand({
    command: {
        name: 'download',
        description: 'Download a Steam Workshop Package',
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
        const message = await interaction.reply({content: "Request Pending."})

        let appid = client.config.commands.appid
        if (client.database.has('appid-' + interaction.guild.id)) {
            appid = client.database.get('appid-' + interaction.guild.id);
        }
        const temp = interaction.options.getString("workshopurl").split("?id=")
        
        const workshopid = temp[temp.length -1]
        const testPattern = /[0-9]+/

        if(testPattern.test(workshopid)){
            try {
                const steamcmd = downloadWorkshopItem(appid, workshopid)
                steamcmd.on("exit", async ()=> {
                    const path = `bin/output/steamapps/workshop/content/${appid}/${workshopid}`
                    if(fs.existsSync(path)){
                        const data = await zip(path)
                        message.edit({content: "Here is the zip downloaded workshop item.", files: [{name: "workshop.zip", attachment: data}]})
                    } else message.edit({ephemeral: true, content: "Unable to find package. Are you sure the workshop item is for the same game this server is associated with?"})
                })   
            } catch (error) {
                console.log(error);
                message.edit({ephemeral: true, content: "An error has occured trying to download the package."})
            }
        } else {
            message.edit({ephemeral: true, content: "Unable to find package."})
        }
        
    }
}).toJSON();