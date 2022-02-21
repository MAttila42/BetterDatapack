const fs = require('fs-extra'),
	path = require('path');

async function mcfunction(f, filePath) {
	let rObj = {
		content: f,
		newFiles: []
	};

	const regex = /(?<=^\/mcfunction )[a-zA-z1-9-_.]+/gm;
	let funcNames = regex.exec(f);
	while (funcNames != null) { // Go through all the declarations
		let newPath = filePath.replace(/\.mcfunction/, '');
		await fs.mkdir(newPath).catch(err => console.error(err)); // Create a new folder for the functions
		newPath = path.resolve(newPath, `${funcNames[0]}.mcfunction`);
		rObj.newFiles.push(newPath);
		
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
		code = code.replaceAll(`\n${/(?<=\n)\s*(?=\/)/ms.exec(code)[0]}`, '\n');
		fs.writeFileSync(newPath, code); // Create new mcfunction file
		funcNames = regex.exec(f);
	}

	rObj.content = f.replaceAll(/\/mcfunction .+\{.*\}/gms, '') // Remove all declarations
	return rObj;
}

module.exports = {
	mcfunction
};
