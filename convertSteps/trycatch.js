// const fs = require('fs-extra'),
// 	path = require('path');

function trycatch(f, filePath, bdconfig) {
	let rObj = {
		content: f,
		newFiles: []
	};
    
    if (f.search(/^\/try/gms) != -1) { // Only do stuff if there are try catches
        let newContent = "";
        newContent += `/scoreboard objectives add ${bdconfig.tryObjective} dummy\n`;
		console.log(newContent);
    }

	return rObj;
}

module.exports = {
	trycatch
};
