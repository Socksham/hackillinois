// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const OpenAI = require('openai')

const API_KEY = "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";

const openai = new OpenAI({
	apiKey: API_KEY,
});


function startRecording() {
	vscode.window.showInformationMessage('Starting Audio');

	analyzeText();
}

async function stopRecording() {
	vscode.window.showInformationMessage('Stopping Audio');

	const options = {
		method: 'GET',
		url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
		params: { term: 'wat' },
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

async function analyzeText() {
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				"role": "user",
				"content": "who is einstein"
			}
		],
		temperature: 1,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});

	console.log(response)
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
