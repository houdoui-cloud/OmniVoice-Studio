import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── In-Memory State & Storage ───────────────────────────────────────────────
let profiles = [
  {
    id: 'aria',
    name: 'Aria (Narrator)',
    category: 'Voice',
    description: 'Warm, articulate narrator with cinematic pacing.',
    gender: 'Female',
    age: 'Adult',
    language: 'en',
    is_preset: true,
    tags: ['narrator', 'calm', 'warm'],
    created_at: Date.now() - 86400000 * 5,
  },
  {
    id: 'roger',
    name: 'Roger (Storyteller)',
    category: 'Story',
    description: 'Resonant, deep storytelling baritone.',
    gender: 'Male',
    age: 'Adult',
    language: 'en',
    is_preset: true,
    tags: ['storyteller', 'dramatic'],
    created_at: Date.now() - 86400000 * 4,
  },
  {
    id: 'elena',
    name: 'Elena (Assistant)',
    category: 'Assistant',
    description: 'Bright, responsive, modern conversational tone.',
    gender: 'Female',
    age: 'Youth',
    language: 'en',
    is_preset: true,
    tags: ['friendly', 'assistant'],
    created_at: Date.now() - 86400000 * 3,
  },
  {
    id: 'marcus',
    name: 'Marcus (News Anchor)',
    category: 'Broadcast',
    description: 'Crisp, authoritative delivery for news and analysis.',
    gender: 'Male',
    age: 'Adult',
    language: 'en',
    is_preset: true,
    tags: ['news', 'authoritative'],
    created_at: Date.now() - 86400000 * 2,
  },
];

let historyItems: any[] = [
  {
    id: 'gen_sample_1',
    created_at: Date.now() - 3600000 * 2,
    timestamp: Date.now() - 3600000 * 2,
    text: 'Welcome to OmniVoice Studio. High-fidelity neural voice synthesis and cloning.',
    voice: 'aria',
    profile_id: 'aria',
    duration: 3.8,
    audio_path: '/audio/sample_1.wav',
    speed: 1.0,
  },
];

let projects: any[] = [];
let dubHistory: any[] = [];
let exportHistory: any[] = [];

// Ensure audio directory exists
const audioDir = path.join(process.cwd(), 'generated_audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Generate a valid WAV file with speech-like harmonics
function createHarmonicWav(seconds = 3): Buffer {
  const sampleRate = 24000;
  const numSamples = Math.floor(sampleRate * seconds);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Speech-like formant frequency tones
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const f0 = 140 + Math.sin(t * 3) * 15;
    const f1 = 600;
    const f2 = 1800;

    const sample =
      (Math.sin(2 * Math.PI * f0 * t) * 0.4 +
        Math.sin(2 * Math.PI * f1 * t) * 0.2 +
        Math.sin(2 * Math.PI * f2 * t) * 0.1) *
      Math.min(1, Math.min(t * 10, (seconds - t) * 10)) *
      0.6;

    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

// Write initial sample file
fs.writeFileSync(path.join(audioDir, 'sample_1.wav'), createHarmonicWav(3.8));

// ── WebSocket Server for Live Realtime Events ───────────────────────────────
const wss = new WebSocketServer({ noServer: true });
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  ws.send(JSON.stringify({ kind: 'ping' }));

  ws.on('close', () => {
    clients.delete(ws);
  });
});

setInterval(() => {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ kind: 'ping' }));
    }
  }
}, 25000);

function broadcastEvent(event: any) {
  const msg = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, 'http://localhost').pathname : '';
  if (pathname === '/ws/events' || pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// ── REST API Endpoints ──────────────────────────────────────────────────────

// Health
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'omnivoice-studio' });
});

// System Info
app.get(['/sysinfo', '/system/sysinfo', '/api/sysinfo'], (req: Request, res: Response) => {
  res.json({
    cpu: 14,
    ram: 38,
    total_ram: 16384,
    vram: 0,
    gpu_active: false,
    device: 'cpu',
    device_name: 'AI Studio Cloud Engine',
    os: 'Linux',
    app_version: '0.4.2',
    backend_version: '0.4.2',
  });
});

// Model Status & Residency
app.get(['/model/status', '/api/model/status'], (req: Request, res: Response) => {
  res.json({
    status: 'ready',
    loaded: true,
    model_loaded: true,
    model: 'omnivoice',
    model_name: 'OmniVoice-V1',
    engine: 'standard',
    device: 'cpu',
  });
});

app.get(['/model/loaded', '/api/model/loaded'], (req: Request, res: Response) => {
  res.json({
    models: [
      {
        id: 'tts',
        name: 'OmniVoice Neural TTS',
        checkpoint: 'omnivoice/v1',
        device: 'cpu',
        vram_mb: 850,
        unloadable: false,
        engine_id: 'omnivoice',
        is_active_engine: true,
      },
      {
        id: 'asr',
        name: 'Whisper Base (Multilingual)',
        checkpoint: 'openai/whisper-base',
        device: 'cpu',
        vram_mb: 320,
        unloadable: true,
        engine_id: 'whisper',
        is_active_engine: true,
      },
    ],
    memory: {
      ram_available_gb: 12.8,
      ram_total_gb: 16.0,
    },
  });
});

// Setup
app.get(['/setup/status', '/api/setup/status'], (req: Request, res: Response) => {
  res.json({
    models_ready: true,
    completed: true,
    state: 'ready',
    first_run: false,
    has_consented: true,
    missing: [],
    hf_cache_dir: '/root/.cache/huggingface',
    disk_free_gb: 48.5,
    min_free_gb: 5,
    enough_disk: true,
  });
});

app.get(['/setup/models', '/api/setup/models'], (req: Request, res: Response) => {
  res.json({
    models: [
      {
        repo_id: 'omnivoice/v1',
        label: 'OmniVoice Neural TTS Engine',
        role: 'TTS',
        size_gb: 2.1,
        required: true,
        installed: true,
        size_on_disk_bytes: 2250000000,
        nb_files: 4,
        supported: true,
        curated: true,
      },
      {
        repo_id: 'openai/whisper-base',
        label: 'Whisper Base Multilingual ASR',
        role: 'ASR',
        size_gb: 0.5,
        required: false,
        installed: true,
        size_on_disk_bytes: 524000000,
        nb_files: 2,
        supported: true,
        curated: true,
      },
    ],
    total_installed_bytes: 2774000000,
    hf_cache_dir: '/root/.cache/huggingface',
    disk_free_gb: 48.5,
    platform_tags: ['linux', 'x86_64'],
  });
});

// Engines
app.get(['/engines', '/api/engines'], (req: Request, res: Response) => {
  res.json({
    tts: {
      active: 'omnivoice',
      backends: [
        {
          id: 'omnivoice',
          display_name: 'OmniVoice Neural TTS',
          status: 'available',
          device: 'cpu',
          is_default: true,
        },
      ],
    },
    asr: {
      active: 'whisper',
      backends: [
        {
          id: 'whisper',
          display_name: 'OpenAI Whisper',
          status: 'available',
          device: 'cpu',
          is_default: true,
        },
      ],
    },
    llm: {
      active: 'builtin',
      backends: [
        {
          id: 'builtin',
          display_name: 'OmniVoice Script Assistant',
          status: 'available',
          device: 'cpu',
          is_default: true,
        },
      ],
    },
  });
});

app.post(['/engines/select', '/api/engines/select'], (req: Request, res: Response) => {
  const { family, backend_id } = req.body || {};
  res.json({
    family: family || 'tts',
    active: backend_id || 'omnivoice',
    env_override: false,
    routing_status: 'ok',
    effective_device: 'cpu',
  });
});

// Profiles
app.get(['/profiles', '/api/profiles'], (req: Request, res: Response) => {
  res.json(profiles);
});

app.post(['/profiles', '/api/profiles'], (req: Request, res: Response) => {
  const profile = {
    id: req.body?.id || `profile_${Date.now()}`,
    name: req.body?.name || 'Custom Voice',
    category: req.body?.category || 'Custom',
    description: req.body?.description || '',
    gender: req.body?.gender || 'Neutral',
    age: req.body?.age || 'Adult',
    language: req.body?.language || 'en',
    tags: req.body?.tags || [],
    created_at: Date.now(),
    is_preset: false,
    ...req.body,
  };
  profiles = [profile, ...profiles.filter((p) => p.id !== profile.id)];
  broadcastEvent({ kind: 'profiles', action: 'created', id: profile.id });
  res.json(profile);
});

app.delete(['/profiles/:id', '/api/profiles/:id'], (req: Request, res: Response) => {
  const id = req.params.id;
  profiles = profiles.filter((p) => p.id !== id);
  broadcastEvent({ kind: 'profiles', action: 'deleted', id });
  res.json({ ok: true, deleted: id });
});

// Generation History
app.get(['/history', '/api/history'], (req: Request, res: Response) => {
  res.json(historyItems);
});

app.delete(['/history/:id', '/api/history/:id'], (req: Request, res: Response) => {
  const id = req.params.id;
  historyItems = historyItems.filter((h) => h.id !== id);
  res.json({ ok: true, deleted: id });
});

// Dub History
app.get(['/dub/history', '/dub_history', '/api/dub/history'], (req: Request, res: Response) => {
  res.json(dubHistory);
});

// Projects
app.get(['/projects', '/api/projects'], (req: Request, res: Response) => {
  res.json(projects);
});

app.post(['/projects', '/api/projects'], (req: Request, res: Response) => {
  const project = {
    id: req.body?.id || `project_${Date.now()}`,
    name: req.body?.name || 'Untitled Project',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...req.body,
  };
  projects = [project, ...projects.filter((p) => p.id !== project.id)];
  broadcastEvent({ kind: 'projects', action: 'created', id: project.id });
  res.json(project);
});

// Export History
app.get(['/exports', '/export_history', '/api/exports'], (req: Request, res: Response) => {
  res.json(exportHistory);
});

// Audio serving
app.use('/audio', express.static(audioDir));
app.use('/api/audio', express.static(audioDir));

// Audio Synthesis Generation Endpoint
app.post(['/generate', '/api/generate'], (req: Request, res: Response) => {
  const text = (req.body?.text || 'Generated speech audio sample.').trim();
  const voice = req.body?.voice || req.body?.profile_id || 'aria';
  const speed = parseFloat(req.body?.speed || '1.0');
  const stream = req.body?.stream === 'true' || req.query?.stream === 'true';

  const duration = Math.max(1.5, Math.min(10, Math.round((text.length / 15) * 10) / 10));
  const audioId = `gen_${Date.now()}`;
  const filename = `${audioId}.wav`;
  const filePath = path.join(audioDir, filename);

  // Generate real playable harmonic speech sound
  fs.writeFileSync(filePath, createHarmonicWav(duration));

  const audioPath = `/audio/${filename}`;
  const newItem = {
    id: audioId,
    timestamp: Date.now(),
    created_at: Date.now(),
    text,
    voice,
    duration,
    audio_path: audioPath,
    speed,
  };
  historyItems = [newItem, ...historyItems];

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'start', id: audioId })}\n\n`);
    setTimeout(() => {
      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          id: audioId,
          audio_path: audioPath,
          duration,
        })}\n\n`
      );
      res.end();
    }, 400);
  } else {
    res.json({
      id: audioId,
      audio_path: audioPath,
      duration,
      text,
      voice,
    });
  }
});

// ── Development / Production Static and Middleware ──────────────────────────
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniVoice Studio server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
