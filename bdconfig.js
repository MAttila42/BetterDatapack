const fs = require('fs-extra'),
	path = require('path');

function config(wPath) {
	let config = { // Default values
		executeNames: 'exec',
		outputPath: path.resolve(wPath, '../bdout'),
		hideInfo: false
	};
	let file;
	try {
		file = JSON.parse(fs.readFileSync(path.resolve(wPath, 'bdconfig.json'))); // Read config from file
	} catch (e) { };
	config = {...config, ...file}; // Overwrite default values
	return config;
}

module.exports = {
	config
};
