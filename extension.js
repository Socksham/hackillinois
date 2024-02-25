const vscode = require('vscode');
const { spawn } = require('child_process');
const recorder = require('node-record-lpcm16');
const fs = require('fs');
const path = require('path');

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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "your-extension-name" is now active!');

    // Specify the path for the audio file
    const audioFilePath = path.join(__dirname, 'recorded_audio.wav');

    // Start recording with default settings
    const recordingProcess = recorder.record({
        sampleRate: 16000,
        channels: 1,
        format: 'wav',
        recorder: 'sox', // Adjust based on your OS and installation
    });

    const fileStream = fs.createWriteStream(audioFilePath);
    recordingProcess.stream().pipe(fileStream);

    let startAudioRecording = vscode.commands.registerCommand('hackillinois.startRecording', async function () {
        vscode.window.showInformationMessage('Starting audio recording...');

        recordingProcess.start();
    });

    let stopAudioRecordingAndTranscribe = vscode.commands.registerCommand('hackillinois.stopRecording', async function () {
        recordingProcess.stop();
        fileStream.end();
        vscode.window.showInformationMessage(`Recording stopped. Audio saved to ${audioFilePath}`);
        await transcribeAndGenerateCode(audioFilePath);
    });

    context.subscriptions.push(startAudioRecording,stopAudioRecordingAndTranscribe );
}

async function transcribeAndGenerateCode(audioFilePath) {
    // Path to the Python executable and transcription script
    const pythonExecutable = '/usr/local/bin/python3'; // Use 'python3' if 'python' doesn't work for your setup
    const transcriptionScriptPath = path.join(__dirname, 'transcribe.py');

    vscode.window.showInformationMessage('Starting transcription...');

    // Execute the transcription script with the audio file path
    const transcribeProcess = spawn(pythonExecutable, [transcriptionScriptPath, audioFilePath]);

    vscode.window.showInformationMessage(transcribeProcess.pid);

    let transcription = '';
    
    transcribeProcess.stdout.on('data', (data) => {
        transcription += data.toString();
    });

    transcribeProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    await new Promise((resolve, reject) => {
        transcribeProcess.on('close', (code) => {
            if (code === 0) {
                console.log("got here")
                vscode.window.showInformationMessage('Transcription complete. Now generating code...');
                const outputFile = path.join(__dirname, 'transcribed_output.txt');
                fs.writeFileSync(outputFile, transcription); // Save transcription
                resolve();
            } else {
                vscode.window.showErrorMessage('Transcription failed');
                reject(new Error('Transcription process failed'));
            }
        });
    });

    // Now run the gptoutput.py script to generate code from the transcription
    await runGptOutputScript();
}

async function runGptOutputScript() {
    const pythonExec = '/usr/local/bin/python3'; // Adjust as needed
    const pyPath = path.join(__dirname, 'gptoutput.py'); // Ensure this is correct

    const gptProcess = spawn(pythonExec, [pyPath]);

    let generatedCode = ``;
	// insertCodeAtCursor(generatedCode);

    gptProcess.stdout.on('data', (data) => {
        generatedCode += data;
        // code += data.toString();
    });

    gptProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    await new Promise((resolve, reject) => {
        gptProcess.on('close', (code) => {
            if (code === 0) {
                vscode.window.showInformationMessage('GPT output script completed successfully.');
                insertCodeAtCursor(generatedCode);
                resolve();
            } else {
                vscode.window.showErrorMessage('GPT output script failed.');
                reject(new Error('GPT output script failed'));
            }
        });
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
