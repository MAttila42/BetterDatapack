// const fs = require('fs-extra'),
// 	path = require('path');

function trycatch(f, filePath, bdconfig) {
	let rObj = {
		content: f,
		newFiles: []
	};
    
    if (f.search(/^\/try\s*{/gms) != -1) { // Only do stuff if there are try catches
        // let newContent = "";
        // newContent += `/scoreboard objectives add ${bdconfig.tryObjective} dummy\n`;
		// console.log(newContent);

		let lastContent = ""; // Will store the last try's content to avoid duplicates
		let tryId = 0;
		const tryRegex = /^\/try\s*{/gms
    }

	return rObj;
}

module.exports = {
	trycatch
};
