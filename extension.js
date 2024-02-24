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

    let combinedRecordingTranscribingDisposable = vscode.commands.registerCommand('hackillinois.speechToText', async function () {
        vscode.window.showInformationMessage('Starting audio recording...');

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

        recordingProcess.start();

        // Define the duration of the recording in milliseconds
        const recordingDurationMs = 10000; // 10 seconds

        // Wait for the recording to finish
        await new Promise(resolve => setTimeout(() => {
            recordingProcess.stop();
            fileStream.end();
            vscode.window.showInformationMessage(`Recording stopped. Audio saved to ${audioFilePath}`);
            resolve();
        }, recordingDurationMs));

        // Proceed with transcribing the audio and generating code
        await transcribeAndGenerateCode(audioFilePath);
    });

    context.subscriptions.push(combinedRecordingTranscribingDisposable);
}

async function transcribeAndGenerateCode(audioFilePath) {
    // Path to the Python executable and transcription script
    const pythonExecutable = '/opt/homebrew/bin/python3'; // Use 'python3' if 'python' doesn't work for your setup
    const transcriptionScriptPath = path.join(__dirname, 'transcribe.py');

    // Execute the transcription script with the audio file path
    const transcribeProcess = spawn(pythonExecutable, [transcriptionScriptPath, audioFilePath]);

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
    const pythonExec = '/opt/homebrew/bin/python3'; // Adjust as needed
    const pyPath = path.join(__dirname, 'gptoutput.py'); // Ensure this is correct

    const gptProcess = spawn(pythonExec, [pyPath]);

    gptProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    gptProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    await new Promise((resolve, reject) => {
        gptProcess.on('close', (code) => {
            if (code === 0) {
                vscode.window.showInformationMessage('GPT output script completed successfully.');
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
