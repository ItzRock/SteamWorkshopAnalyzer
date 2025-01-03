const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

// Function to recursively add files and folders to JSZip
async function addFolderToZip(zip, folderPath, zipFolderPath = '') {
    const items = await fs.promises.readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(folderPath, item.name);
        const zipPath = path.join(zipFolderPath, item.name);

        if (item.isDirectory()) {
            const folderZip = zip.folder(zipPath);
            await addFolderToZip(folderZip, fullPath);
        } else if (item.isFile()) {
            const fileData = await fs.promises.readFile(fullPath);
            zip.file(zipPath, fileData);
        }
    }
}

// Main function to zip a folder and return the buffer
async function zipFolder(folderPath) {
    const zip = new JSZip();
    await addFolderToZip(zip, folderPath);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    return zipBuffer;
}

module.exports = zipFolder