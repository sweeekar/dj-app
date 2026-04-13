from flask import Flask, request, jsonify
import librosa
import numpy as np

app = Flask(__name__)


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.post('/analyze')
def analyze():
    payload = request.get_json(silent=True) or {}
    file_path = payload.get('filePath')

    if not file_path:
        return jsonify({'error': 'filePath is required'}), 400

    try:
        y, sr = librosa.load(file_path, mono=True)
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        duration = librosa.get_duration(y=y, sr=sr)
        spectral_centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))

        beat_times = librosa.frames_to_time(beat_frames, sr=sr)
        loop_candidates = []
        if len(beat_times) >= 8:
            for i in range(0, len(beat_times) - 8, 8):
                loop_candidates.append({
                    'start': float(beat_times[i]),
                    'end': float(beat_times[i + 7])
                })
                if len(loop_candidates) >= 3:
                    break

        return jsonify({
            'bpm': float(tempo),
            'duration': float(duration),
            'beats': beat_times.tolist(),
            'loopCandidates': loop_candidates,
            'spectralCentroid': spectral_centroid
        })
    except Exception as exc:
        return jsonify({'error': str(exc)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
