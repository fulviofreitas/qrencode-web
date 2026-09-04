import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

// Reserved delimiters in the WIFI: payload format must be backslash-escaped.
const escapeWifiValue = (value) => value.replace(/([\\;,:])/g, '\\$1');

const buildWifiString = ({ ssid, password, encryption, hidden }) => {
  let payload = `WIFI:T:${encryption};S:${escapeWifiValue(ssid)};`;
  if (encryption !== 'nopass') {
    payload += `P:${escapeWifiValue(password)};`;
  }
  if (hidden) {
    payload += 'H:true;';
  }
  return `${payload};`;
};

export default function Home() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setFieldErrors({});
    setError(null);
    setQrCode(null);
  };

  const generateQR = async (e) => {
    e.preventDefault();

    let value;
    if (mode === 'wifi') {
      const errors = {};
      if (!ssid.trim()) errors.ssid = 'SSID is required';
      if (encryption !== 'nopass' && !password) {
        errors.password = 'Password is required for secured networks';
      }
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;

      value = buildWifiString({ ssid, password, encryption, hidden });
    } else {
      if (!text.trim()) return;
      value = text;
    }

    setLoading(true);
    setError(null);
    setQrCode(null);

    try {
      const res = await fetch(`/api/qr?text=${encodeURIComponent(value)}`);
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
          <p className={styles.subtitle}>
            {mode === 'wifi'
              ? 'Enter your network details to generate a Wi-Fi QR code'
              : 'Enter text or a URL to generate a QR code'}
          </p>

          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => switchMode('text')}
              className={mode === 'text' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            >
              Text / URL
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'wifi'}
              onClick={() => switchMode('wifi')}
              className={mode === 'wifi' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            >
              Wi-Fi Network
            </button>
          </div>

          <form onSubmit={generateQR} className={styles.form}>
            {mode === 'text' ? (
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text..."
                className={styles.input}
                required
                autoFocus
              />
            ) : (
              <>
                <div className={styles.field}>
                  <label htmlFor="ssid" className={styles.label}>
                    Network name (SSID)
                  </label>
                  <input
                    id="ssid"
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="MyNetwork"
                    className={styles.input}
                    autoFocus
                  />
                  {fieldErrors.ssid && <p className={styles.fieldError}>{fieldErrors.ssid}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="encryption" className={styles.label}>
                    Encryption
                  </label>
                  <select
                    id="encryption"
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className={styles.select}
                  >
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>

                {encryption !== 'nopass' && (
                  <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <input
                      id="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Network password"
                      className={styles.input}
                    />
                    {fieldErrors.password && (
                      <p className={styles.fieldError}>{fieldErrors.password}</p>
                    )}
                  </div>
                )}

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className={styles.checkbox}
                  />
                  Hidden network
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'text' && !text.trim())}
              className={styles.button}
            >
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
