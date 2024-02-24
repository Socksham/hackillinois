const vscode = require('vscode');
const { spawn } = require('child_process');
const recorder = require('node-record-lpcm16');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "your-extension-name" is now active!');

    let startRecordingDisposable = vscode.commands.registerCommand('hackillinois.startRecording', function () {
        vscode.window.showInformationMessage('Starting audio recording...');

        // Specify the path for the audio file
        const audioFilePath = path.join(__dirname, 'recorded_audio.wav');

        // Start recording with default settings
        const recordingProcess = recorder.record({
            sampleRate: 16000,
            channels: 1,
            format: 'wav',
            // Adjust the recorder options based on your OS and installation
            recorder: 'sox', // 'sox' for Linux/macOS, 'rec' for Windows with SoX installed
        });

        const fileStream = fs.createWriteStream(audioFilePath);
        recordingProcess.stream().pipe(fileStream);

        recordingProcess.start();

        // Stop recording after 5 seconds
        setTimeout(() => {
            recordingProcess.stop();
            fileStream.end();
            vscode.window.showInformationMessage(`Recording stopped. Audio saved to ${audioFilePath}`);
        }, 5000);
    });

    let transcribeAudioDisposable = vscode.commands.registerCommand('hackillinois.transcribeAudio', function () {
        vscode.window.showInformationMessage('Transcribing audio...');

        // Path to the Python executable. Use 'python3' if 'python' doesn't work.
        const pythonExecutable = 'python3';

        // Path to your transcribe.py script
        const scriptPath = path.join(__dirname, 'transcribe.py');

        // Path to the audio file you want to transcribe
        const audioFilePath = path.join(__dirname, 'recorded_audio.wav');

        const process = spawn(pythonExecutable, [scriptPath, audioFilePath]);

        let transcription = '';

        process.stdout.on('data', (data) => {
            transcription += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log('Transcription complete');
                vscode.window.showInformationMessage('Transcription complete. Check the console for details.');
                // Process the transcription as needed
                console.log(transcription);
            } else {
                vscode.window.showErrorMessage('Transcription failed');
                console.error(`Transcription process exited with code ${code}`);
            }
        });
    });

    context.subscriptions.push(startRecordingDisposable, transcribeAudioDisposable);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
