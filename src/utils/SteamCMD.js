const { spawn, exec } = require("child_process");
const downloadWorkshopItem = (appid, fileid) => {
    const platform = process.platform;
    let steamcmdPath;

    let steamcmd

    const args = [
        "+force_install_dir",  process.cwd(), "/output",
        "+login", "anonymous",
        "+workshop_download_item", appid, fileid,
        "+quit"
    ];

    if (platform === "linux") {
        steamcmdPath = "steamcmd "; // assuming steamcmd is a global

        steamcmd = exec(steamcmdPath + args.join(" "), (error, stdout, stderr)=> {

        });
    } else if (platform === "win32") {
        steamcmdPath = "./bin/steamcmd/steamcmd.exe";
        steamcmd = spawn(steamcmdPath, args);
    } else {
        console.warn("SteamCMD is not supported on this platform.");
        return;
    }

    steamcmd.on("error", (error) => {
        console.error(`Failed to start SteamCMD: ${error.message}`);
    });
    return steamcmd
};
module.exports = downloadWorkshopItem
