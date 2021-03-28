const vscode = require('vscode');
const datapack = require('./datapack');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('The extension \'better-datapack\' is now active!');

	let convert = vscode.commands.registerCommand('better-datapack.convert', function () {
		datapack.convert();
	});
	context.subscriptions.push(convert);

	let convertButton = vscode.StatusBarItem;
	convertButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	convertButton.command = 'better-datapack.convert';
	convertButton.text = '$(debug-start) Convert';
	context.subscriptions.push(convertButton);
	convertButton.show();
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
