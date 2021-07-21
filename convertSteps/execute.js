const fs = require('fs-extra'),
	path = require('path')

async function execute(f, filePath, bdconfig) {
	let rObj = {
		content: f,
		newFiles: []
	};
	
	if (f.search(/\/execute.*?run\s*?\{/gms) != -1) { // Only do stuff if there is need for better execute
		let newPath = filePath.replace('.mcfunction', ''); // Path to the folder where the exec mcfunctions will go
		await fs.mkdir(newPath).catch(err => console.error(err)); // Create a new folder for the exec mcfunctions
		
		let lastContent = ""; // Will store the last execute's content to avoid duplicates
		let execId = 0;
		const executeRegex = /\/execute.*?run\s*?\{/gms; // Search for all the executes
		let executeStart;
		while ((executeStart = executeRegex.exec(f)) != null) { // Look through the found executes
			let execute = executeStart[0], // Will contain the full execute
				open = 1,
				close = 0;
			for (let i of f.slice(executeRegex.lastIndex)) { // Go throught the string one character at a time
				execute += i;
				if (i == '{') open++;
				if (i == '}') close++;
				if (open == close) break; // If every braces are closed then we have the full execute
			}
			if (execute == lastContent.trim()) continue; // If this execute was the content of the last execute then don't do anything with it

			let commands = /(?<=run\s*?\{).*(?=\})/gms.exec(execute)[0]; // Execute's commands
			lastContent = commands; // Save the content
			newPath = path.resolve(newPath, `${bdconfig.executeNames}${execId}.mcfunction`); // Complete the path with the exec mcfunction
			fs.writeFileSync(newPath, commands); // Create the file
			rObj.newFiles.push(newPath);
			
			let condition = /\/execute.*?run\s*/gms.exec(execute)[0], // Execute's condition
				functionPath = "", // Will contain a constructed function path
				afterNamespace = false,
				firstFolder = true,
				pathFolders = newPath.split(path.sep); // List of the folders in the path
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
			rObj.content = rObj.content.replace(execute, `${condition.trimEnd()} function ${functionPath}`); // Replace the execute with the new converted one
			newPath = path.resolve(newPath, '../');
			execId++;
		}
	}
	return rObj;
}

module.exports = {
	execute
};
