const { ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const downloadWorkshopItem = require("../../utils/SteamCMD")
const fs = require("fs/promises")
require("moment-duration-format");

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
        }, {
            name: "dllonly",
            description: "By default the bot will only send the DLLs but disable this to get the zip.",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
        ]
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

        
        // let appid = client.config.commands.appid
        // if (client.database.has('appid-' + interaction.guild.id)) {
        //     appid = client.database.get('appid-' + interaction.guild.id);
        // }
        // const temp = interaction.options.getString("workshopurl").split("?id=")
        
        // const workshopid = temp[temp.length -1]
        // const testPattern = /[0-9]+/
        // if(testPattern.test(workshopid)){
        //     try {
        //         const steamcmd = downloadWorkshopItem(appid, workshopid)
        //         steamcmd.on("exit", async ()=> {
        //             const directory = await fs.readdir(`bin/output/steamapps/workshop/content/${appid}/${workshopid}`)
        //         })   
        //     } catch (error) {
        //         console.log(error);
                
        //     }
        // } else {
        //     interaction.reply({ephemeral: true, content: "Unable to find package."})
        // }
        
    }
}).toJSON();