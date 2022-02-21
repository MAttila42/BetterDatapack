const path = require('path');
const { runTests } = require('vscode-test');
try {
	const extensionDevelopmentPath = path.resolve(__dirname, '../');
	const extensionTestsPath = path.resolve(__dirname, './suite/index');
	runTests({ extensionDevelopmentPath, extensionTestsPath });
} catch (err) {
	console.error('Failed to run tests');
	process.exit(1);
}
