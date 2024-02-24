// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function startRecording() {
	vscode.window.showInformationMessage('Starting Audio');
	
}

function stopRecording() {
	vscode.window.showInformationMessage('Stopping Audio');
	
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let started = false;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hackillinois" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let start = vscode.commands.registerCommand('hackillinois.start', function () {
		// The code you place here will be executed every time your command is executed

		if (!started) {
			console.log("HERE")
			startRecording();
			started = true;
		}

	});

	let stop = vscode.commands.registerCommand('hackillinois.stop', function () {
		// The code you place here will be executed every time your command is executed
		if (started) {
			// Display a message box to the user
			stopRecording();
			started = false;
		}

	});

	context.subscriptions.push(start, stop);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
