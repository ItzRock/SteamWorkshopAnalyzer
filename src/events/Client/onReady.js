const { success, info, warn } = require("../../utils/Console");
const Event = require("../../structure/Event");
const { EmbedBuilder, WebhookClient } = require("discord.js")
module.exports = new Event({
    event: 'ready',
    once: true,
    run: (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.")

        info("Starting Webhook Information")
        // Workshop Webhook things.
        const newItemsURL = `https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${process.env.STEAM_API_KEY}&query_type=1&filetype=0&numperpage=5`
        const updatedItemsURL = `https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${process.env.STEAM_API_KEY}&query_type=21&filetype=0&numperpage=5`
        const itemDetailsURL = `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`
        const playerInfo = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=`
        const differentGames = [client.config.commands.appid] // In theory client could do roughly 22 games before reaching the steam api limit
        if (differentGames.length > 22) warn("Warning! A bot with too many different AppIds may reach the api limit for steam at 100,000 per day if its checked every minute.")
        client.guilds.cache.forEach(guild => {
            if (client.database.has('appid-' + guild.id)) {
                let appid = client.database.get('appid-' + guild.id);
                if (!differentGames.includes(appid)) differentGames.push(appid)
            }
        })
        function PostUpdateWebhook(appid, itemId, filedetails, authorData) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: authorData.personaname,
                    url: authorData.profileurl,
                    iconURL: authorData.avatar,
                })
                .setTitle(filedetails.title)
                .setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${itemId}`)
                .setThumbnail(filedetails.preview_url)
                .setDescription(filedetails.description > 480 ? filedetails.description.substring(0, 480) + "..." : filedetails.description)
                .setColor("#00b0f4")
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.avatarURL(),
                })
                .setTimestamp(filedetails.time_updated * 1000);

            client.guilds.cache.forEach(guild => {
                if (client.database.has('webhook-' + guild.id)) {
                    let guildappId = client.config.commands.appid
                    if (client.database.has('appid-' + guild.id)) {
                        guildappId = client.database.get('appid-' + guild.id);
                    }
                    if (guildappId == appid) {
                        const webhookURL = client.database.get('webhook-' + guild.id)
                        const webhookClient = new WebhookClient({ url: webhookURL })
                        webhookClient.send({ username: filedetails.time_updated == filedetails.time_created ? "New Mod Release" : "Mod Update", avatarURL: client.user.avatarURL(), embeds: [embed] })
                    }
                }
            })
        }
        differentGames.forEach(appid => {
            async function CheckWorkshop() {
                info("Checking Workshop")
                const data = {
                    newModsHandled: [],
                    lastUpdatedHandled: []
                }
                const hasDataYet = client.database.has(`${appid}-newmods`)
                const hasUpdatedMods = client.database.has(`${appid}-updates`)

                let lastNewMods = hasDataYet ? JSON.parse(client.database.get(`${appid}-newmods`)) : []
                let lastUpdatedMods = hasUpdatedMods ? JSON.parse(client.database.get(`${appid}-updates`)) : []

                // Check for new Mods
                let newModsRequest = await fetch(newItemsURL + `&appid=${appid}`)
                if (newModsRequest.ok) {
                    const newModsData = await newModsRequest.json()
                    if (hasDataYet) {
                        let newMods = []
                        newModsData.response.publishedfiledetails.forEach(item => {
                            if (!lastNewMods.includes(item.publishedfileid)) newMods.push(item.publishedfileid);
                        })
                        info("Found " + newMods.length + " new mods")
                        if (newMods.length > 0) {
                            // Go over new mods
                            info("Getting details about new mod")
                            const bodyRequest = new URLSearchParams({ key: process.env.STEAM_API_KEY, itemcount: newMods.length })
                            for (let i = 0; i < newMods.length; i++) {
                                const modId = newMods[i];
                                bodyRequest.append(`publishedfileids[${i}]`, modId)
                            }
                            const pbfdReq = await fetch(itemDetailsURL, { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, mode: "cors", cache: "default", body: bodyRequest })
                            if (pbfdReq.ok) {
                                const publishedFileDetails = (await pbfdReq.json()).response.publishedfiledetails
                                const authors = []
                                publishedFileDetails.forEach(mod => {
                                    authors.push(mod.creator)
                                })
                                const userReq = await fetch(playerInfo + authors.join(","))
                                if (userReq.ok) {
                                    const userData = (await userReq.json()).response.players
                                    for (let i = 0; i < userData.length; i++) {
                                        const user = userData[i];
                                        const mod = publishedFileDetails[i]
                                        PostUpdateWebhook(appid, newMods[i], mod, user)
                                    }

                                } else return warn(`Failed to request author information. ${userReq.statusText}`)
                            } else return warn("Failed: " + pbfdReq.status)
                        }
                    }
                    newModsData.response.publishedfiledetails.forEach(item => {
                        data.newModsHandled.push(item.publishedfileid);
                        client.database.set(`${appid}-newmods`, JSON.stringify(data.newModsHandled))
                    })
                } else warn(`Request failed for new mods: ${newModsRequest.status}`)
                // Check for Updated mods
                let modUpdatesRequest = await fetch(updatedItemsURL + `&appid=${appid}`)
                if (modUpdatesRequest.ok) {
                    const updatedModsData = (await modUpdatesRequest.json()).response.publishedfiledetails
                    if (true) {
                        // We have to get the published information earlier so we know what time they updated at.

                        const bodyRequest = new URLSearchParams({ key: process.env.STEAM_API_KEY, itemcount: updatedModsData.length })
                        for (let i = 0; i < updatedModsData.length; i++) {
                            const modId = updatedModsData[i].publishedfileid;
                            bodyRequest.append(`publishedfileids[${i}]`, modId)
                        }
                        const pbfdReq = await fetch(itemDetailsURL, { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, mode: "cors", cache: "default", body: bodyRequest })
                        if (pbfdReq.ok) {
                            const publishedFileDetails = (await pbfdReq.json()).response.publishedfiledetails
                            const unhandledUpdates = []
                            const authors = []
                            publishedFileDetails.forEach(mod => {
                                if (!lastUpdatedMods.includes(`${mod.publishedfileid}+${mod.time_updated}`)) { unhandledUpdates.push(mod); authors.push(mod.creator); data.lastUpdatedHandled.push(`${mod.publishedfileid}+${mod.time_updated}`) }
                            })
                            info(`Found ${authors.length} updates`)
                            if (authors.length > 0) {
                                const userReq = await fetch(playerInfo + authors.join(","))
                                if (userReq.ok) {
                                    const userData = (await userReq.json()).response.players
                                    for (let i = 0; i < userData.length; i++) {
                                        const user = userData[i];
                                        const mod = unhandledUpdates[i]
                                        PostUpdateWebhook(appid, unhandledUpdates[i].publishedfileid, mod, user)
                                    }
                                    client.database.set(`${appid}-updates`, JSON.stringify(data.lastUpdatedHandled))
                                } else return warn(`Failed to request author information. ${userReq.statusText}`)
                            }
                        } else return warn("Failed: " + pbfdReq.status)
                    }
                } else warn(`Request failed for new mods: ${modUpdatesRequest.status}`)

            }
            setInterval(CheckWorkshop, client.config.commands.interval * 1000)
            CheckWorkshop()
        })
    }
}).toJSON();