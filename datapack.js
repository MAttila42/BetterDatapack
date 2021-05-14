const vscode = require('vscode'),
  fs = require('fs-extra'),
  path = require('path'),
  rimraf = require('rimraf');

async function convert() {
  // Check if ran from a folder
  if (vscode.workspace.workspaceFolders == undefined) {
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
  if (path.basename(filePath) == 'bdconfig.json') {
    await fs.unlink(filePath)
  }

  if (path.extname(filePath) == '.mcfunction') {
    let f = fs.readFileSync(filePath, 'utf-8');

    f = '\n' + f; // Add a new line for bug purposes
    f = f.replaceAll(/#.*/g, ''); // Remove comments
    f = f.replaceAll(/\s+$/gm, ''); // Remove ending whitespaces
    // f = await betterExecute(f) // Better execute
    f = await declareFunction(f, filePath); // Declare functions
    f = rearrange(f); // Rearrange the lines

    fs.writeFileSync(filePath, f);
  }
}

async function betterExecute(f) {
  if (f.search(/\/execute.*run \{/)) { // Only do stuff if there is need for better execute
    const executes = /\/execute.*run \{.*?\}/gms; // Search for all the better executes
    let execute;
    while ((execute = executes.exec(f)) != null) { // Go through all the executes
      let commands = /(?<=\/execute.*run \{).*?(?=\})/gms.exec(execute[0])[0].split(/\r?\n/);
      console.log(execute);
      console.log(commands);
      
      executes.lastIndex;
    }
  }
  return f;
}

async function declareFunction(f, filePath) {
  if (f.search(/^\/mcfunction [a-zA-z1-9-_.]+/gm) > 0) { // Only do stuff if there is a function declaration
    const regex = /(?<=^\/mcfunction )[a-zA-z1-9-_.]+/gm;
    let funcNames;
    while ((funcNames = regex.exec(f)) != null) { // Go through all the declarations
      let newPath = filePath.replace(/\.mcfunction/, '');
      await fs.mkdir(newPath).catch(err => console.error(err)); // Create a new folder for the functions
      newPath = path.resolve(newPath, `${funcNames[0]}.mcfunction`);
      let code = (new RegExp(`(?<=\\n/mcfunction ${funcNames[0]} \\{).*?(?=\\n\\})`, 'gms')).exec(f)[0]; // Get the code from declaration
      await fs.writeFile(newPath, rearrange(code.replaceAll(`\n${/(?<=\n)\s*(?=\/)/ms.exec(code)[0]}`, '\n'))); // Write in new file with the leading whitespaces removed
      regex.lastIndex;
    }
  }
  return f.replaceAll(/\/mcfunction .+?\n}/gms, '');
}

function rearrange(f) {
  f = f.replaceAll(/^ +/gm, ' '); // Remove whitespaces
  f = f.replaceAll(/(?!\r?\n\/)\r?\n/g, ''); // Rearrange by slashes
  f = f.replaceAll(/(^\/| \/)/gm, ' '); // Remove slashes
  f = f.replaceAll(/\\\//g, '/'); // Remove escape characters
  f = f.replaceAll(/^ /gm, ''); // Remove single whitespace at the start of each line
  return f;
}

module.exports = {
  convert
};
