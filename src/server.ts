import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

interface StoredPhoto {
  id: string;
  dataUrl: string;
  publicUrl?: string;
  createdAt: number;
}
const photoStore = new Map<string, StoredPhoto>();

setInterval(() => {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  for (const [id, photo] of photoStore.entries()) {
    if (photo.createdAt < cutoff) {
      photoStore.delete(id);
    }
  }
}, 60 * 60 * 1000);

async function uploadToPomf(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const form = new FormData();
  form.append('files[]', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);

  const res = await fetch('https://pomf.lain.la/upload.php', {
    method: 'POST',
    body: form,
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`pomf HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    files?: { url?: string }[];
  };

  const url = json.files?.[0]?.url;
  if (!url || !url.startsWith('http')) {
    throw new Error('pomf returned no file URL');
  }
  return url;
}

async function uploadToUguu(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const form = new FormData();
  form.append('files[]', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: form,
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`uguu HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    files?: { url?: string }[];
  };

  const url = json.files?.[0]?.url;
  if (!url || !url.startsWith('http')) {
    throw new Error('uguu returned no file URL');
  }
  return url;
}

async function uploadToFreeimage(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const form = new FormData();
  form.append('key', '6d207e02198a847aa98d0a2a901485a5');
  form.append('action', 'upload');
  form.append('source', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
  form.append('format', 'json');

  const res = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    body: form,
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    throw new Error(`freeimage HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    status_code?: number;
    image?: { url?: string; display_url?: string };
  };

  const url = json.image?.url || json.image?.display_url;
  if (!url || !url.startsWith('http')) {
    throw new Error('freeimage returned no image URL');
  }
  return url;
}

app.post('/api/photos', async (req: Request, res: Response) => {
  const { dataUrl } = req.body;
  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid dataUrl' });
  }

  const id = crypto.randomBytes(4).toString('hex');
  let publicUrl: string | undefined;

  try {
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    const mimeType = match ? match[1] : 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : 'jpg';
    const base64Data = match ? match[2] : dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `loykrathong-${id}.${ext}`;

    try {
      publicUrl = await Promise.any([
        uploadToPomf(buffer, mimeType, filename),
        uploadToUguu(buffer, mimeType, filename),
      ]);
    } catch {
      publicUrl = await uploadToFreeimage(buffer, mimeType, filename);
    }
  } catch (err) {
    console.warn('All public image uploads failed:', err);
  }

  photoStore.set(id, {
    id,
    dataUrl,
    publicUrl,
    createdAt: Date.now(),
  });

  const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
  const localViewUrl = appUrl ? `${appUrl}/view/${id}` : `/view/${id}`;
  const targetViewUrl = publicUrl || localViewUrl;

  res.json({
    id,
    viewUrl: targetViewUrl,
    localUrl: localViewUrl,
    publicUrl: publicUrl || null,
  });
});

app.get('/api/photos/:id', (req: Request, res: Response) => {
  const photo = photoStore.get(req.params.id);
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found or expired' });
  }
  res.json({ id: photo.id, dataUrl: photo.dataUrl, publicUrl: photo.publicUrl, createdAt: photo.createdAt });
});

app.get('/view/:id', (req: Request, res: Response) => {
  const photo = photoStore.get(req.params.id);
  const photoId = req.params.id;

  res.send(`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>รูปถ่ายวันลอยกระทง | เทศบาล ๕ วัดพระปฐมเจดีย์</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Kanit', sans-serif;
      background: radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 50%, #020617 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 12px;
      -webkit-font-smoothing: antialiased;
    }
    .header { text-align: center; margin-bottom: 12px; padding-top: 6px; }
    .badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 6px;
    }
    h1 { font-size: 1.15rem; font-weight: 600; color: #fef08a; text-shadow: 0 0 16px rgba(234, 179, 8, 0.4); }
    p.sub { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
    .photo-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      max-width: 440px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .img-wrapper { width: 100%; border-radius: 10px; overflow: hidden; background: #000; display: flex; justify-content: center; }
    .photo-img { width: 100%; height: auto; display: block; object-fit: contain; max-height: 72vh; border-radius: 6px; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; margin-top: 14px; }
    .btn {
      appearance: none; border: none; cursor: pointer; font-family: inherit; font-weight: 500;
      font-size: 0.9rem; padding: 11px 14px; border-radius: 12px;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none;
    }
    .btn-download { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; }
    .btn-print { background: rgba(255, 255, 255, 0.1); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); }
    .tip { margin-top: 12px; font-size: 0.75rem; color: #cbd5e1; text-align: center; line-height: 1.4; }
    @media print {
      body { background: transparent !important; padding: 0 !important; margin: 0 !important; display: block !important; }
      .header, .actions, .tip, .badge { display: none !important; }
      .photo-card, .img-wrapper { background: none !important; box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; border-radius: 0 !important; }
      .photo-img { max-height: 100vh !important; width: 100% !important; border-radius: 0 !important; }
      @page { margin: 0; size: auto; }
    }
  </style>
</head>
<body>
  ${
    photo
      ? `
    <div class="header">
      <div class="badge">🌸 สุขสันต์วันลอยกระทง ๒๕๖๗ 🌸</div>
      <h1>ลอยกระทงโฟโต้บูท</h1>
      <p class="sub">เทศบาล ๕ วัดพระปฐมเจดีย์</p>
    </div>
    <div class="photo-card">
      <div class="img-wrapper">
        <img id="mainPhoto" class="photo-img" src="${photo.dataUrl}" alt="รูปถ่ายวันลอยกระทง" />
      </div>
      <div class="actions">
        <a id="downloadBtn" href="${photo.dataUrl}" download="loykrathong-photo-${photoId}.jpg" class="btn btn-download">บันทึกรูป</a>
        <button onclick="window.print()" class="btn btn-print">พิมพ์รูป</button>
      </div>
      <p class="tip">💡 สำหรับผู้ใช้มือถือและ iPad สามารถกดค้างที่รูปภาพเพื่อเลือก <b>"บันทึกรูปภาพ"</b> หรือ <b>"แชร์"</b> ได้โดยตรง</p>
    </div>`
      : `<div class="photo-card" style="padding: 30px 16px; text-align: center;"><h2>ไม่พบรูปภาพ</h2></div>`
  }
</body>
</html>`);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
