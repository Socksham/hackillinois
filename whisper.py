import whisper
import sys
import json

model = whisper.load_model("base")
result = model.transcribe(sys.argv[1])

print(json.dumps(result))