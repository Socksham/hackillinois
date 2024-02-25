// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

let timerInterval;
let seconds = 0;

function startRecording() {
	vscode.window.showInformationMessage('Starting Audio');
	timerInterval = setInterval(updateTimer, 1000);
	// const generatedCode = `for (int i = 0; i < 15; i++) {\n\t// Your generated code here\n}\n`;
	// insertCodeAtCursor(generatedCode);
}


function stopRecording() {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Stopping Audio...",
        cancellable: false
    }, async (progress, token) => {
        // Simulate stopping recording process
        clearInterval(timerInterval);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `Recorded: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        vscode.window.setStatusBarMessage(formattedTime);

        vscode.window.showInformationMessage('Recording stopped');
    });
}

async function insertCodeAtCursor(code) {
	// Get the active text editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No active text editor.");
		return;
	}

	// Get the current cursor position
	const position = editor.selection.active;

	// Insert the code at the cursor position
	await editor.edit(editBuilder => {
		editBuilder.insert(position, code);
	});

	// Move the cursor to the end of the inserted code
	const newPosition = position.with(position.line, position.character + code.length);
	editor.selection = new vscode.Selection(newPosition, newPosition);
}

function updateTimer() {
	seconds++;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedTime = `Recording: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	vscode.window.setStatusBarMessage(formattedTime);
}

async function getDefinition(term) {
	const options = {
		method: 'GET',
		url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
		params: { term },
		headers: {
			'X-RapidAPI-Key': 'f4d6869ce0mshf4d311faa5eed26p1f9bd7jsn669ab8478190',
			'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
		}
	};

	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
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
};

