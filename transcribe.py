import whisper
import sys
def transcribe_audio(audio_path):
    model = whisper.load_model("tiny")
    result = model.transcribe(audio_path)
    print(result['text'])

if __name__ == "__main__":
    import sys
    audio_path = sys.argv[1]
    transcribe_audio(audio_path)