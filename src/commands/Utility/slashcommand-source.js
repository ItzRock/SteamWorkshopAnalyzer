const { ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const downloadWorkshopItem = require("../../utils/SteamCMD")
require("moment-duration-format");
const ilspycmd = require("../../utils/ilspycmd")
const fs = require("fs")
module.exports = new ApplicationCommand({
    command: {
        name: 'source',
        description: 'Decompile and view the source of a .net workshop item.',
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

        let tasksStarted = 0
        const attachments = []
        async function SearchFolder(path){
            const items = fs.readdirSync(path)
            items.forEach(file => {
                if(fs.statSync(`${path}/${file}`).isDirectory()){ SearchFolder(`${path}/${file}`) }
                if(file.includes(".dll")){
                    tasksStarted++;
                    const promise = ilspycmd(`${path}/${file}`)
                    promise.then((data)=>{
                        tasksStarted--;
                        console.log(tasksStarted);
                        
                        attachments.push({name: file.replace(".dll",".cs"), attachment: new Buffer.from(data.data)})  
                        if(tasksStarted == 0){
                            message.edit({content: "Here is the source of all the workshop items.", files: attachments})
                        }
                    })
                }
            })
        }

        if(testPattern.test(workshopid)){
            try {
                const steamcmd = downloadWorkshopItem(appid, workshopid)
                steamcmd.on("exit", async ()=> {
                    const path = `bin/output/steamapps/workshop/content/${appid}/${workshopid}`
                    if(fs.existsSync(path)){
                        SearchFolder(path)
                    } else message.edit({ephemeral: true, content: "Unable to find package. Are you sure the workshop item is for the same game this server is associated with?"}) // later try to find the app id from some steam request... or ask the user 
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