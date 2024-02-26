const path = require("path");
global.fs = require("fs");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function writeFileSyncRecursive(filename, content, charset) {
  const folders = filename.split(path.sep).slice(0, -1);
  if (folders.length) {
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath;
    });
  }
  fs.writeFileSync(filename, content, charset);
}

async function processFolders() {
  writeFileSyncRecursive(`./static/ai.json`, {
    data: process.env.OPENAI,
  });
  console.log("\x1b[46m", `✓ Folders generated`, "\x1b[0m");
}

async function processItems(arr) {
  processFolders();
}

processItems();
