const { success, info } = require("../../utils/Console");
const Event = require("../../structure/Event");
const { EmbedBuilder, WebhookClient } = require("discord.js")
module.exports = new Event({
    event: 'ready',
    once: true,
    run: (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.")

        info("Starting Webhook Information")
        // Workshop Webhook things.
        const baseURL = `https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${process.env.STEAM_API_KEY}&query_type=21&filetype=0&numperpage=1`
        
        const differentGames = [client.config.commands.appid] // In theory client could do roughly 22 games before reaching the steam api limit
        if (differentGames.length > 22) warn("Warning! A bot with too many different AppIds may reach the api limit for steam at 100,000 per day if its checked every minute.")
        client.guilds.cache.forEach(guild => {
            if (client.database.has('appid-' + guild.id)) {
                let appid = client.database.get('appid-' + guild.id);
                if (!differentGames.includes(appid)) differentGames.push(appid)
            }
        })

        differentGames.forEach(appid => {
            async function CheckWorkshop() {
                info("Checking Workshop")
                const getURL = baseURL + `&appid=${appid}`
                const request = await fetch(getURL)
                if (request.ok) {
                    const data = await request.json()
                    // First we're going to see if the first item is the same and if 
                    const workshopId = data.response.publishedfiledetails[0].publishedfileid
                    const infoReq = await fetch("https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/", { method: "POST", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, mode:"cors", cache:"default", body: new URLSearchParams({ key: process.env.STEAM_API_KEY, "publishedfileids[0]": workshopId, itemcount: 1 }) })
                    if (infoReq.ok) {
                        const infoData = (await infoReq.json()).response.publishedfiledetails[0]
                        const id = workshopId + infoData.time_updated
                        if (client.database.has(`lastdata-${appid}`)) {
                            const storedLastHandled = client.database.get(`lastdata-${appid}`)
                            if (storedLastHandled != id) {
                                // Okay lets post client update.
                                // Get author information now.
                                const authorRequest = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${infoData.creator}`)
                                if (authorRequest.ok) {
                                    const authorData = (await authorRequest.json()).response.players[0]
                                    const embed = new EmbedBuilder()
                                        .setAuthor({
                                            name: authorData.personaname,
                                            url: authorData.profileurl,
                                            iconURL: authorData.avatar,
                                        })
                                        .setTitle(infoData.title)
                                        .setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`)
                                        .setThumbnail(infoData.preview_url)
                                        .setDescription(infoData.description > 480 ? infoData.description.substring(0,496) + "..." : infoData.description)
                                        .setColor("#00b0f4")
                                        .setFooter({
                                            text: client.user.displayName,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp(infoData.time_updated * 1000);
                                    
                                    client.guilds.cache.forEach(guild => {
                                        if (client.database.has('webhook-' + guild.id)) {
                                            let guildappId = client.config.commands.appid
                                            if (client.database.has('appid-' + guild.id)) {
                                                guildappId = client.database.get('appid-' + guild.id);
                                            }
                                            if(guildappId == appid){
                                                const webhookURL = client.database.get('webhook-' + guild.id)
                                                const webhookClient = new WebhookClient({url: webhookURL})
                                                webhookClient.send({username: infoData.time_updated == infoData.time_created ? "New Mod Release" : "Mod Update", avatarURL: client.user.avatarURL(), embeds: [embed]})
                                            }
                                        }
                                    })

                                    client.database.set(`lastdata-${appid}`, id)
                                } else warn("Author Request Failed!")
                            }
                        } else {
                            // record the data and move on 
                            client.database.set(`lastdata-${appid}`, id)
                        }
                    } else {warn("Published Infomarion Request Failed!"); console.log(infoReq)}
                } else warn("Request Failed!")
            }
            setInterval(CheckWorkshop, client.config.commands.interval * 1000)
            CheckWorkshop()
        })
    }
}).toJSON();