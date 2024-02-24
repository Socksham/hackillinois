// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');
// const axios = require('axios');

// function startRecording() {
// 	vscode.window.showInformationMessage('Starting Audio');

// }

// async function stopRecording() {
// 	vscode.window.showInformationMessage('Stopping Audio');

// 	const options = {
// 		method: 'GET',
// 		url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
// 		params: { term: 'wat' },
// 		headers: {
// 			'X-RapidAPI-Key': 'f4d6869ce0mshf4d311faa5eed26p1f9bd7jsn669ab8478190',
// 			'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
// 		}
// 	};

// 	try {
// 		const response = await axios.request(options);
// 		console.log(response.data);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// /**
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {

// 	let started = false;

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "hackillinois" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let start = vscode.commands.registerCommand('hackillinois.start', function () {
// 		// The code you place here will be executed every time your command is executed

// 		if (!started) {
// 			console.log("HERE")
// 			startRecording();
// 			started = true;
// 		}

// 	});

// 	let stop = vscode.commands.registerCommand('hackillinois.stop', function () {
// 		// The code you place here will be executed every time your command is executed
// 		if (started) {
// 			// Display a message box to the user
// 			stopRecording();
// 			started = false;
// 		}

// 	});

// 	context.subscriptions.push(start, stop);
// }

// // This method is called when your extension is deactivated
// function deactivate() { }

// module.exports = {
// 	activate,
// 	deactivate
// }

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

let timerInterval;
let timerValue = 0;

function startRecording() {
    vscode.window.showInformationMessage('Starting Audio');
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

function startTimer() {
    timerInterval = setInterval(() => {
        timerValue++;
        updateTimerUI();
    }, 1000); // Update timer every second (1000 milliseconds)
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerUI() {
    // Display the timer value in the status bar
    vscode.window.setStatusBarMessage(`Timer: ${timerValue}s`, 1000);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    let started = false;

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let start = vscode.commands.registerCommand('hackillinois.start', function () {
        // The code you place here will be executed every time your command is executed

        if (!started) {
            console.log("HERE")
            startRecording();
            startTimer(); // Start the timer when the "start" command is called
            started = true;
        }

    });

    let stop = vscode.commands.registerCommand('hackillinois.stop', function () {
        // The code you place here will be executed every time your command is executed
        if (started) {
            // Display a message box to the user
            stopRecording();
            stopTimer(); // Stop the timer when the "stop" command is called
            started = false;
        }

    });

    context.subscriptions.push(start, stop);
}

// This method is called when your extension is deactivated
function deactivate() {
    stopTimer(); // Stop the timer when the extension deactivates
}

module.exports = {
    activate,
    deactivate
};
