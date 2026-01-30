# Emotion Server

Simple HTTP server for Reachy Mini robot emotions. Stores a single emotion value that gets cleared after being read (one-shot pattern).

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check, returns `{ status: "ok", hasEmotion: bool }` |
| GET | `/emotion?secret=...` | Read and clear emotion (returns `{ emotion: "dance1" }` or `{ emotion: null }`) |
| POST | `/emotion?secret=...` | Set emotion (body: `{ "emotion": "dance1" }`) |
| DELETE | `/emotion?secret=...` | Clear emotion without reading |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3456 | Server port |
| `EMOTION_SECRET` | `monte-emotion-secret` | Secret for authentication |

## Usage

```bash
# Install
npm install

# Run
npm start

# Or with custom config
PORT=3456 EMOTION_SECRET=my-secret npm start
```

## API Examples

```bash
# Set emotion
curl -X POST http://localhost:3456/emotion?secret=monte-emotion-secret \
  -H "Content-Type: application/json" \
  -d '{"emotion": "dance1"}'

# Get emotion (clears it)
curl http://localhost:3456/emotion?secret=monte-emotion-secret

# Health check
curl http://localhost:3456/health
```

## Valid Emotions

From Reachy Mini emotions library:
```
surprised1, surprised2, enthusiastic1, enthusiastic2, cheerful1,
laughing1, laughing2, curious1, inquiring1, inquiring3,
understanding2, thoughtful1, amazed1, confused1, uncertain1, lost1,
proud1, proud2, success1, success2, shy1, serenity1,
sad1, displeased2, boredom1, boredom2, oops2,
dance1, dance2, dance3
```
