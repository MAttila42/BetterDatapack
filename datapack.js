const vscode = require('vscode'),
  fs = require('fs-extra'),
  path = require('path'),
  rimraf = require('rimraf');

async function convert() {
  // Check if ran from a folder
  if (vscode.workspace.workspaceFolders === undefined) {
    console.error('Can\'t find workspace folder.\nQuitting.');
    vscode.window.showErrorMessage('Can\'t find workspace folder.');
    return;
  }

  // Get the path
  let wPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let bdcPath = path.resolve(wPath, 'bdconfig.json');

  // Get the config
  let bdconfig;
  try {
    bdconfig = JSON.parse(fs.readFileSync(bdcPath));
  } catch (e) {
    bdconfig = {
      outputPath: ''
    }
  }
  let oPath = bdconfig.outputPath;
  if (oPath == '') {
    oPath = path.resolve(wPath, '../bdout');
  }

  // Copy project files to location
  rimraf.sync(oPath);
  await fs.copy(wPath, oPath, { overwrite: true }).catch(err => console.error(err));

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
  if (path.basename(filePath) === 'bdconfig.json') {
    await fs.unlink(filePath)
  }

  if (path.extname(filePath) === '.mcfunction') {
    let f = fs.readFileSync(filePath, 'utf-8');
    f = f.replaceAll(/#.*/g, ''); // Remove comments
    f = f.replaceAll(/^ +/gm, ' '); // Remove whitespaces
    f = f.replaceAll(/(?!\r?\n\/)\r?\n/g, ''); // Rearrange by slashes
    f = f.replaceAll(/(^\/| \/)/g, ' '); // Remove slashes
    f = f.replaceAll(/\\\//g, '/'); // Remove escape characters

    fs.writeFileSync(filePath, f);
  }
}

module.exports = {
  convert
};
