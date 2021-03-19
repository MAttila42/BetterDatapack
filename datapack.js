const vscode = require("vscode"),
  fs = require("fs-extra"),
  path = require("path"),
  rimraf = require("rimraf");

function convert() {
  console.log("Converting...");
  // Check if ran from a folder
  if (vscode.workspace.workspaceFolders === undefined) {
    console.error("Can't find workspace folder.\nQuitting.");
    vscode.window.showErrorMessage("Can't find workspace folder.");
    return;
  }

  // Get the path
  let wPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let bdcPath = path.resolve(wPath, "bdconfig.json");

  // Get the config
  let dbconfig;
  try {
    dbconfig = JSON.parse(fs.readFileSync(bdcPath));
  } catch (e) {
    console.error("bdconfig.json is missing or incorrect.\nQuitting.");
    vscode.window.showErrorMessage(`bdconfig.json is missing or incorrect. ${bdcPath} ${e}`);
    return;
  }
  const oPath = dbconfig.outputPath;

  // Copy
  rimraf.sync(oPath);
  fs.copySync(wPath, oPath, { overwrite: true });

  // Convert
  function walk(dir, callback) {
    fs.readdir(dir, function (err, files) {
      if (err) throw err;
      files.forEach(function (file) {
        var filepath = path.join(dir, file);
        fs.stat(filepath, function (err, stats) {
          if (stats.isDirectory()) {
            callback(filepath, stats);
            walk(filepath, callback);
          } else if (stats.isFile()) {
            callback(filepath, stats);
          }
        });
      });
    });
  }
  walk(oPath, manageFile);
  vscode.window.showInformationMessage(`Datapack got converted to ${oPath}`);
}

async function manageFile(filePath, stats) {
  if (stats.isDirectory()) {
    return;
  }
  if (path.basename(filePath) === "bdconfig.json") {
    await fs.unlink(filePath)
  }

  if (path.extname(filePath) === ".mcfunction") {
    removeComments(filePath);
    arrangeBySlashes(filePath);
  }
}

function removeComments(path) {
  // Read file line-by-line
  let fileOut = '';
  let f = fs.readFileSync(path, 'utf-8').split(/\r?\n/);
  for (let i of f) {
    // Remove comments with Regex
    fileOut += '\n' + i.replace(/#.*/i, '');
  }
  // Write to file
  fs.writeFileSync(path, fileOut);
}

function arrangeBySlashes(path) {
  // Read file line-by-line
  let fileOut = '';
  let f = fs.readFileSync(path, 'utf-8').split(/\r?\n/);
  for (let i of f) {
    // Sort everything by slashes and remove
    if (i.startsWith('/')) {
      fileOut += '\n';
    } else {
      while (i.startsWith('  ')) {
        i = i.substring(1);
      }
    }
    fileOut += i.replace(/(^\/| \/)/, ' ').replace(/\\\//, '/');
  }
  // Write to file
  fs.writeFileSync(path, fileOut);
}

module.exports = {
  convert
};
