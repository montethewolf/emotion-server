/**
 * Emotion Server for Reachy Mini
 * 
 * Simple HTTP server that stores a single emotion value.
 * - POST /emotion { "emotion": "dance1" } - Set the current emotion
 * - GET /emotion - Get and clear the current emotion (one-shot)
 */

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3456;
const SECRET = process.env.EMOTION_SECRET || 'monte-emotion-secret';

// Store single emotion in memory
let currentEmotion = null;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasEmotion: currentEmotion !== null });
});

// GET /emotion - Read and clear (one-shot)
app.get('/emotion', (req, res) => {
  // Verify secret
  const secret = req.query.secret || req.headers['x-emotion-secret'];
  if (secret !== SECRET) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  const emotion = currentEmotion;
  currentEmotion = null; // Clear after read
  
  res.json({ emotion });
});

// POST /emotion - Set emotion
app.post('/emotion', (req, res) => {
  // Verify secret
  const secret = req.query.secret || req.headers['x-emotion-secret'];
  if (secret !== SECRET) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  const { emotion } = req.body;
  
  if (!emotion) {
    return res.status(400).json({ error: 'Missing emotion field' });
  }

  currentEmotion = emotion;
  console.log(`[Emotion] Set: ${emotion}`);
  
  res.json({ success: true, emotion });
});

// DELETE /emotion - Clear without reading
app.delete('/emotion', (req, res) => {
  const secret = req.query.secret || req.headers['x-emotion-secret'];
  if (secret !== SECRET) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  currentEmotion = null;
  res.json({ success: true, cleared: true });
});

app.listen(PORT, () => {
  console.log(`[Emotion Server] Running on port ${PORT}`);
  console.log(`[Emotion Server] Secret: ${SECRET.slice(0, 4)}...`);
});
