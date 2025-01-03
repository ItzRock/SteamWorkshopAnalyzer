# Steam Workshop Analyzer.
A discord bot for managing webhooks, download, and analyzing of .Net DLLs.

## Requirements
SteamCMD - for Windows https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip, for Linux follow the installation from valve's docs. https://developer.valvesoftware.com/wiki/SteamCMD
ilspycmd - https://github.com/icsharpcode/ILSpy/tree/master/ICSharpCode.ILSpyCmd install command `dotnet tool install --global ilspycmd`
Optional but I recommend running it in a PM2 process - https://pm2.keymetrics.io/

## Installation
1) Clone the repository
2) provide a copy of SteamCMD to `bin/steamcmd/` if your running in windows.
3) create a `database.yml` in the root and fill out the template files `.env` and `config.js`.
4) pray it works.
5) Optionally optimize the `src/utils/SteamCMD.js` and `src/utils/ilspycmd.js` to how your server may manage steamcmd 
## Contributing
Feel free to contribute I am totally okay with any changes, if you add new features please do give me a heads up on my opinion though. Just open a pull request and asign me (@ItzRock)
## Credits
Modification of https://github.com/TFAGaming/DiscordJS-V14-Bot-Template