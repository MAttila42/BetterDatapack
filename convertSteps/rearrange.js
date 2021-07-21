function rearrange(f) {
	f = f.replaceAll(/^[ \t]+/gm, ' ') // Remove long whitespaces
		.replaceAll(/(?!\r?\n\s*\/)\r?\n/g, '') // Rearrange by slashes
		// .replaceAll(/\/mcfunction .+\{.*\}/gms, '') // Remove function declarations
		.replaceAll(/(^\/| \/)/gm, ' ') // Remove slashes
		.replaceAll(/\\\//g, '/') // Remove escape characters
		.replaceAll(/^\s/gm, ''); // Remove single whitespace at the start of each line
	return {
		content: f,
		newFiles: []
	};
}

module.exports = {
	rearrange
};
