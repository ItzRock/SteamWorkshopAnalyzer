const { spawn } = require("child_process");
const downloadWorkshopItem = (appid, fileid) => {
    const platform = process.platform;
    let steamcmdPath;

    if (platform === "linux") {
        steamcmdPath = "../../bin/steamcmd/steamcmd.sh";
    } else if (platform === "win32") {
        steamcmdPath = "../../bin/steamcmd/steamcmd.exe";
    } else {
        console.warn("SteamCMD is not supported on this platform.");
        return;
    }

    const args = [
        "+force_install_dir", "../output",
        "+login", "anonymous",
        "+workshop_download_item", appid, fileid,
        "+quit"
    ];

    const steamcmd = spawn(steamcmdPath, args);

    steamcmd.on("error", (error) => {
        console.error(`Failed to start SteamCMD: ${error.message}`);
    });
    return steamcmd
};
module.exports = downloadWorkshopItem
