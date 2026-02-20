import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQR = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setQrCode(null);

    try {
      const res = await fetch(`/api/qr?text=${encodeURIComponent(text)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to generate QR code');

      setQrCode(data.qrCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>QR Code Generator</title>
        <meta name="description" content="Generate QR codes instantly from text or URLs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>QR Code Generator</h1>
          <p className={styles.subtitle}>Enter text or a URL to generate a QR code</p>

          <form onSubmit={generateQR} className={styles.form}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or any text..."
              className={styles.input}
              required
              autoFocus
            />
            <button type="submit" disabled={loading || !text.trim()} className={styles.button}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          {qrCode && (
            <div className={styles.result}>
              <img src={qrCode} alt="Generated QR Code" className={styles.qrImage} />
              <a href={qrCode} download="qrcode.png" className={styles.download}>
                Download PNG
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
