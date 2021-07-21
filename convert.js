const vscode = require('vscode'),
	fs = require('fs-extra'),
	path = require('path'),
	rimraf = require('rimraf'),
	{ config } = require('./bdconfig'),
	{ clean } = require('./convertSteps/clean'),
	{ execute } = require('./convertSteps/execute'),
	{ mcfunction } = require('./convertSteps/mcfunction'),
	{ rearrange } = require('./convertSteps/rearrange');

async function convertDatapack() {
	// Get the path to the workspace folder
	let wPath;
	try {
		wPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
	} catch (e) {
		console.error('Can\'t find workspace folder.\n' + e);
		vscode.window.showErrorMessage('Can\'t find workspace folder.');
		return;
	}

	// Get the configs
	const bdConfig = config(wPath);
	const oPath = bdConfig.outputPath;

	// Copy project files to location
	rimraf.sync(oPath);
	await fs.copy(wPath, oPath, { overwrite: true }).catch(err => console.error(err));
	await fs.unlink(path.resolve(oPath, 'bdconfig.json'));
	let files = await walk(oPath);

	// Convert the files
	while (files.length > 0) {
		let f = fs.readFileSync(files[0], 'utf-8');
		function convertStep(obj) {
			try {
				files = [...files, ...obj.newFiles];
			} catch (e) { }
			f = obj.content;
		}

		convertStep(clean(f));
		convertStep(await execute(f, files[0], bdConfig));
		convertStep(await mcfunction(f, files[0]));
		convertStep(rearrange(f));

		fs.writeFileSync(files[0], f);
		files.shift();
	}

	vscode.window.showInformationMessage(`Datapack got converted to ${bdConfig.outputPath}`);
}

async function walk(dir) {
	let files = [];
	const entries = await fs.readdir(dir);
	for (let v of entries) {
		v = path.join(dir, v);
		const stats = await fs.stat(v);
		if (stats.isDirectory()) {
			files = [...files, ...await walk(v)];
		} else if (path.extname(v) == '.mcfunction') {
			files.push(v);
		}
	}
	return files;
}

module.exports = {
	convertDatapack
};
