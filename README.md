# QR Code Generator

A simple web app that generates QR codes from text or URLs, built with Next.js and deployable on Vercel.

## Features

- Generate QR codes from any text or URL
- Clean, responsive UI
- Download generated QR codes as PNG
- Serverless-ready — no CLI dependencies

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **QR Code Library**: [`qrcode`](https://www.npmjs.com/package/qrcode)
- **Styling**: CSS Modules
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/fulviofreitas/qrencode-web.git
cd qrencode-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

### Option A — Vercel Dashboard (recommended)

1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `qrencode-web` repository
4. Vercel auto-detects Next.js — click **Deploy**

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel
```

## API

### `GET /api/qr?text=<value>`

Generates a QR code PNG for the given text.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `text`    | Yes      | Text or URL to encode (max 2048 chars) |

**Success response:**
```json
{
  "qrCode": "data:image/png;base64,..."
}
```

**Error response:**
```json
{
  "error": "Text parameter is required"
}
```

## Project Structure

```
qrencode-web/
├── pages/
│   ├── _app.js       # App wrapper
│   ├── index.js      # Main UI
│   └── api/
│       └── qr.js     # QR generation API route
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── next.config.js
└── package.json
```

## License

MIT
