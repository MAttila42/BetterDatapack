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
		// f = f.replaceAll(/^\s+/gm, ''); // Remove starting whitespaces
		f = f.replaceAll(/\s+$/gm, ''); // Remove ending whitespaces
		f = await convertExecutes(f, filePath, stats) // Convert better executes to normal
		await declareFunctions(f, filePath); // Declare functions
		f = rearrange(f); // Rearrange the lines

		fs.writeFileSync(filePath, f);
	}
}

async function convertExecutes(f, filePath, stats) {
	let f2 = f;
	if (f.search(/\/execute.*?run\s*?\{/gms) != -1) { // Only do stuff if there is need for better execute
		let newPath = filePath.replace(/\.mcfunction/, ''); // Path of the folder where the exec mcfunctions will go
		await fs.mkdir(newPath).catch(err => console.error(err)); // Create a new folder for the exec mcfunctions

		let lastContent = ""; // Will store the last execute's content to avoid duplicates
		let execId = 0;
		const executeRegex = /\/execute.*?run\s*?\{/gms; // Search for all the executes
		let executeStart;
		while ((executeStart = executeRegex.exec(f)) != null) { // Look through the found executes
			let execute = executeStart[0]; // Will contain the full execute
			let starters = 1;
			let enders = 0;
			for (let i of f.slice(executeRegex.lastIndex)) { // Go throught the string one character at a time
				execute += i;
				if (i == '{') starters++;
				if (i == '}') enders++;
				if (starters == enders) break; // If every braces are closed then we have the full execute
			}
			if (execute == lastContent.trim()) continue; // If this execute was the content of the last execute then don't do anything with it

			const conditions = /\/execute.*?run\s*/gms; // Look for the condition of the execute
			let condition;
			while ((condition = conditions.exec(execute)) != null) { // Go through the conditions (only 1 result but still)
				const commands = /(?<=run\s*?\{).*(?=\})/gms; // Look for the commands in the execute
				let inside; // 'let inside' lmao xdd LOL much funny LAUGH!!1!
				while ((inside = commands.exec(execute)) != null) { // Go through the commands found in the brackets of the execute (only 1 result but still)
					lastContent = inside[0]; // Save the content
					newPath = path.resolve(newPath, `exec${execId}.mcfunction`); // Complete the path with the exec mcfunction
					fs.writeFileSync(newPath, inside[0]); // Create the file
					manageFile(newPath, stats); // Recursively manage the contents of this file
				}
				
				let functionPath = ""; // Will contain a constructed function path
				let afterNamespace = false;
				let firstFolder = true;
				let pathFolders = newPath.split(path.sep); // List of the folders in the path
				for (let i in pathFolders) { // Go through the indexes of the list
					if (afterNamespace) { // If we already added the namespace to the path
						functionPath += `${firstFolder ? "" : "/"}${path.basename(pathFolders[i], ".mcfunction")}`; // Add the new folder or file to the path
						firstFolder = false;
					}
					if (pathFolders[i] == "functions" && !afterNamespace) { // If we haven't found the namespace and currently looking at a functions folder then we can find it
						functionPath += `${pathFolders[i - 1]}:`; // Add the namespace folder to the path
						afterNamespace = true;
					}
				}
				f2 = f2.replace(execute, `${condition[0].trimEnd()} function ${functionPath}`); // Replace the execute with the new converted one
				newPath = path.resolve(newPath, '../')
			}
			execId++;
		}
	}
	return f2;
}

async function declareFunctions(f, filePath) {
	if (f.search(/^\/mcfunction [a-zA-z1-9-_.]+/gm) > 0) { // Only do stuff if there is a function declaration
		const regex = /(?<=^\/mcfunction )[a-zA-z1-9-_.]+/gm;
		let funcNames;
		while ((funcNames = regex.exec(f)) != null) { // Go through all the declarations
			let newPath = filePath.replace(/\.mcfunction/, '');
			await fs.mkdir(newPath).catch(err => console.error(err)); // Create a new folder for the functions
			newPath = path.resolve(newPath, `${funcNames[0]}.mcfunction`);
			const mcfunctionRegex = new RegExp(`\\n/mcfunction ${funcNames[0]} ?\\{`, 'gm');
			let code = '';
			while (mcfunctionRegex.exec(f) != null) {
				let starters = 1;
				let enders = 0;
				for (let i of f.slice(mcfunctionRegex.lastIndex)) {
					if (i == '{') starters++;
					if (i == '}') enders++;
					if (starters == enders) break; // If every braces are closed then we have the full code
					code += i;
				}
			}
			await fs.writeFile(newPath, rearrange(code.replaceAll(`\n${/(?<=\n)\s*(?=\/)/ms.exec(code)[0]}`, '\n'))); // Write in new file with the leading whitespaces removed
		}
	}
}

function rearrange(f) {
	f = f.replaceAll(/^[ \t]+/gm, ' ') // Remove long whitespaces
		.replaceAll(/(?!\r?\n\s*\/)\r?\n/g, '') // Rearrange by slashes
		.replaceAll(/\/mcfunction .+\{.*\}/g, '') // Remove function declarations
		.replaceAll(/(^\/| \/)/gm, ' ') // Remove slashes
		.replaceAll(/\\\//g, '/') // Remove escape characters
		.replaceAll(/^\s/gm, ''); // Remove single whitespace at the start of each line
	return f;
}

module.exports = {
	convert
};
