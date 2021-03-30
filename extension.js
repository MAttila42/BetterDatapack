const vscode = require('vscode');
const datapack = require('./datapack');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let convert = vscode.commands.registerCommand('better-datapack.convert', function () {
		datapack.convert();
	});
	context.subscriptions.push(convert);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
