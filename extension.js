const vscode = require('vscode');
// const datapack = require('./datapack');
const { convertDatapack } = require('./convert');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let convert = vscode.commands.registerCommand('better-datapack.convert', function () {
		// datapack.convert();
		convertDatapack();
	});
	context.subscriptions.push(convert);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
