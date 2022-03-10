function trycatch(f, filePath, bdconfig) {
	let rObj = {
		content: f,
		newFiles: []
	};
    
	const tryRegex = /^\/try\s*{/gms;
    if (f.search(tryRegex) != -1) { // Only do stuff if there are try catches

		// THIS needs to go in the bdLoad mcfunction
        // let newContent = "";
        // newContent += `/scoreboard objectives add ${bdconfig.tryObjective} dummy\n`;

		let lastContent = ""; // Will store the last results content to avoid duplicates
		let start = tryRegex.exec(f);
		while (start != null) { // Look through the matches
			let full = start[0], // Will contain the full result
				tryBlock = "", // Will contain the content of the try block
				catchBlock = "", // Will contain the content of the catch block
				open = 1,
				close = 0;
			for (let i of f.slice(tryRegex.lastIndex)) { // Go throught the string one character at a time
				full += i;
				if (i == '{') open++;
				if (i == '}') close++;
				if (open == close) break; // If every braces are closed then we have the full result
			}
			if (lastContent.includes(full)) continue; // If this result is the content of the last result then don't do anything with it

			let tryContent = /(?<=\{).*(?=\})/gms;
		}
    }

	return rObj;
}

module.exports = {
	trycatch
};
