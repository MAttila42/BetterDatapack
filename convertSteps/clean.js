function clean(f) {
	f = '\n' + f; // Add a new line for bug purposes
	f = f.replaceAll(/#.*/g, ''); // Remove comments
	f = f.replaceAll(/\s+$/gm, ''); // Remove ending whitespaces

	return {
		content: f,
		newFiles: []
	};
}

module.exports = {
	clean
};
