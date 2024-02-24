// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const recorder = require('node-record-lpcm16');
const fs = require('fs');
const path = require('path');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	let disposable = vscode.commands.registerCommand('extension.startRecording', function () {
        vscode.window.showInformationMessage('Starting audio recording...');

        // Specify the path for the audio file
        // Adjust the path as needed, using workspace folders or a temporary directory
        const audioFilePath = path.join(__dirname, 'recorded_audio.wav');

        // Start recording with default settings
        const recording = recorder.record({
            sampleRate: 16000,
            channels: 1,
            format: 'wav',
            // Adjust the recorder options based on your OS and installation
            recorder: 'sox', // 'sox' for Linux/macOS, 'rec' for Windows with SoX installed
        });

        const fileStream = fs.createWriteStream(audioFilePath);
        recording.stream().pipe(fileStream);

        recording.start();

        // Example: Stop recording after 5 seconds
        // Implement your logic for stopping the recording as needed
        setTimeout(() => {
            recording.stop();
			fileStream.end();
            vscode.window.showInformationMessage(`Recording stopped. Audio saved to ${audioFilePath}`);
        }, 5000);
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
