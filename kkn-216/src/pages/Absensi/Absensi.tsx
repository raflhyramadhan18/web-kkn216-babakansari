import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import { members } from '../../data/members';
import './Absensi.css';

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */
const KKN_START = new Date('2026-07-21T00:00:00+07:00');
const KKN_END   = new Date('2026-08-25T23:59:59+07:00');
const OPEN_H    = 7;  // 07:xx WIB
const CLOSE_H   = 8;  // 08:xx WIB

/* ─────────────────────────────────
   Get current time as WIB (Jakarta, UTC+7)
   Works correctly on any device timezone
───────────────────────────────── */
function getWIB(): Date {
  // toLocaleString with Asia/Jakarta gives a string in WIB local time
  // Parse it back to get a Date whose .getHours()/.getMinutes() are WIB values
  const now = new Date();
  const wibStr = now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  return new Date(wibStr);
}

function isWindowOpen(wib: Date): boolean {
  const h = wib.getHours(), m = wib.getMinutes();
  const t = h * 60 + m;
  return t >= OPEN_H * 60 && t < CLOSE_H * 60;
}

function isKKNPeriod(wib: Date): boolean {
  return wib >= KKN_START && wib <= KKN_END;
}

function getKKNDay(wib: Date): number {
  const diffMs = wib.getTime() - KKN_START.getTime();
  return Math.floor(diffMs / 86400000) + 1;
}

function getDateKey(wib: Date): string {
  return wib.toISOString().split('T')[0];
}

function minsUntilOpen(wib: Date): number {
  const h = wib.getHours(), m = wib.getMinutes();
  const current = h * 60 + m;
  if (current < OPEN_H * 60) return OPEN_H * 60 - current;
  // already past today's window — until tomorrow 07:00
  return (24 * 60 - current) + OPEN_H * 60;
}

function minsUntilClose(wib: Date): number {
  const h = wib.getHours(), m = wib.getMinutes();
  return CLOSE_H * 60 - (h * 60 + m);
}

function fmtCountdown(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h} jam ${m} menit`;
  return `${m} menit`;
}

function fmtTime(d: Date): string {
  // d is already a WIB Date — format as HH:mm:ss
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function fmtDate(d: Date): string {
  // d is already a WIB Date — format nicely
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/* ─────────────────────────────────
   API endpoint:
   - In dev: calls GAS directly if VITE_GAS_URL is set
   - In production (Vercel): calls /api/absensi
───────────────────────────────── */
const GAS_URL      = import.meta.env.VITE_GAS_URL as string | undefined;
const ABSENSI_API  = '/api/absensi';

/* ─────────────────────────────────
   Component
───────────────────────────────── */
type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'closed' | 'outside-kkn' | 'error';

const Absensi: React.FC = () => {
  const [wib, setWib]         = useState(getWIB());
  const [nama, setNama]       = useState('');
  const [nim, setNim]         = useState('');
  const [status, setStatus]   = useState<Status>('idle');
  const [errMsg, setErrMsg]   = useState('');

  /* tick every second */
  useEffect(() => {
    const id = setInterval(() => setWib(getWIB()), 1000);
    return () => clearInterval(id);
  }, []);

  /* auto-fill NIM when name selected */
  useEffect(() => {
    const found = members.find(m => m.name === nama);
    setNim(found?.nim ?? '');
  }, [nama]);

  const alreadySubmitted = useCallback(() => {
    if (!nim) return false;
    const key = `kkn216_absen_${nim}_${getDateKey(wib)}`;
    return !!localStorage.getItem(key);
  }, [nim, wib]);

  const open    = isWindowOpen(wib);
  const inKKN   = isKKNPeriod(wib);
  const kkDay   = inKKN ? getKKNDay(wib) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nim) return;

    // ⚡ Period check DISABLED during testing — enable on go-live by uncommenting:
    // if (!inKKN)  { setStatus('outside-kkn'); return; }

    if (!open)   { setStatus('closed'); return; }
    if (alreadySubmitted()) { setStatus('duplicate'); return; }

    setStatus('loading');

    const hariKe = inKKN ? kkDay : 0; // 0 = test mode
    const payload = {
      nama,
      nim,
      tanggal: fmtDate(wib),
      waktu: fmtTime(wib),
      hariKe,
    };

    try {
      // ── Try Vercel API first (works in production) ──
      // ── In dev, fallback to GAS directly if VITE_GAS_URL is set ──
      let success = false;

      if (GAS_URL) {
        // Dev mode: call GAS directly with no-cors (response is opaque, we trust it)
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
        // no-cors gives opaque response, assume success
        success = true;
      } else {
        // Production: use Vercel API route
        const res = await fetch(ABSENSI_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { message?: string; code?: string };
          if (data.code === 'DUPLICATE') { setStatus('duplicate'); return; }
          throw new Error(data.message ?? 'Gagal menghubungi server');
        }
        success = true;
      }

      if (success) {
        // Save to localStorage as frontend duplicate-lock
        localStorage.setItem(`kkn216_absen_${nim}_${getDateKey(wib)}`, fmtTime(wib));
        setStatus('success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setErrMsg(msg);
      setStatus('error');
    }
  };

  const reset = () => { setStatus('idle'); setErrMsg(''); };

  /* ── render ── */
  return (
    <div className="absensi-page" style={{ paddingTop: '72px' }}>

      {/* ── HEADER ── */}
      <section className="page-header" style={{ background: 'var(--color-accent)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge"
            style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            ✋ Absensi KKN
          </motion.span>
          <motion.h1 className="page-header__title"
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            ABSENSI!
          </motion.h1>
          <motion.p className="page-header__sub"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            KKN 216 Babakansari — 21 Juli s.d. 25 Agustus 2026
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">HADIR!</div>
      </section>

      {/* ── MAIN ── */}
      <section className="section-padding">
        <div className="container absensi-layout">

          {/* ── LEFT: Clock + Status ── */}
          <div className="absensi-status-col">

            {/* Clock card */}
            <motion.div className="clock-card comic-card"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Clock size={28} strokeWidth={3} color="var(--color-primary)" />
              <div className="clock-time">{fmtTime(wib)}</div>
              <div className="clock-date">{fmtDate(wib)}</div>
              <div className="clock-zone">Waktu Indonesia Barat (WIB, UTC+7)</div>
            </motion.div>

            {/* Status card */}
            <motion.div
              className={`status-card comic-card ${open ? 'status-card--open' : 'status-card--closed'}`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
              <div className="status-card__dot" />
              <div className="status-card__text">
                {open
                  ? <>🟢 <strong>ABSENSI BUKA</strong><br />Tutup dalam {fmtCountdown(minsUntilClose(wib))}</>
                  : <>🔴 <strong>ABSENSI TUTUP</strong><br />Buka dalam {fmtCountdown(minsUntilOpen(wib))}</>
                }
              </div>
              <div className="status-card__window">Jam absensi: 07:00 – 08:00 WIB</div>
            </motion.div>

            {/* KKN day info */}
            {inKKN ? (
              <motion.div className="kkn-day-card comic-card"
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                <span className="kkn-day-num">{kkDay}</span>
                <div>
                  <p className="kkn-day-label">Hari KKN ke-</p>
                  <p className="kkn-day-sub">Dari 36 hari pengabdian</p>
                </div>
              </motion.div>
            ) : (
              <motion.div className="kkn-day-card kkn-day-card--pending comic-card"
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                <span className="kkn-day-num">📅</span>
                <div>
                  <p className="kkn-day-label">
                    {wib < KKN_START ? 'KKN belum dimulai' : 'KKN telah selesai'}
                  </p>
                  <p className="kkn-day-sub">
                    {wib < KKN_START
                      ? `Mulai 21 Juli 2026`
                      : `Berakhir 25 Agustus 2026`}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: Form ── */}
          <motion.div className="absensi-form-col"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

            <AnimatePresence mode="wait">

              {/* SUCCESS */}
              {status === 'success' && (
                <motion.div key="success" className="absensi-result absensi-result--success comic-card"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="result-icon">✅</div>
                  <h2 className="result-title">HADIR!</h2>
                  <p className="result-msg"><strong>{nama}</strong></p>
                  <p className="result-sub">Absensi hari ke-<strong>{kkDay}</strong> berhasil dicatat!</p>
                  <p className="result-time">{fmtTime(wib)} WIB</p>
                  <div className="result-badge">
                    <CheckCircle size={16} strokeWidth={3} />
                    Data tersimpan ke Google Sheets
                  </div>
                </motion.div>
              )}

              {/* DUPLICATE */}
              {status === 'duplicate' && (
                <motion.div key="dup" className="absensi-result absensi-result--warn comic-card"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="result-icon">⚠️</div>
                  <h2 className="result-title">SUDAH ABSEN!</h2>
                  <p className="result-msg"><strong>{nama}</strong></p>
                  <p className="result-sub">Kamu sudah absen hari ini. Sampai besok jam 07:00!</p>
                  <button className="comic-btn comic-btn-primary result-btn" onClick={reset}>
                    <RotateCcw size={16} strokeWidth={3} /> Kembali
                  </button>
                </motion.div>
              )}

              {/* CLOSED / OUTSIDE */}
              {(status === 'closed' || status === 'outside-kkn') && (
                <motion.div key="closed" className="absensi-result absensi-result--error comic-card"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="result-icon">🔒</div>
                  <h2 className="result-title">{status === 'outside-kkn' ? 'DI LUAR PERIODE KKN' : 'BELUM WAKTUNYA!'}</h2>
                  <p className="result-sub">
                    {status === 'outside-kkn'
                      ? 'Absensi hanya tersedia 21 Juli – 25 Agustus 2026.'
                      : `Absensi dibuka pukul 07:00 – 08:00 WIB. Sekarang ${fmtTime(wib)}.`}
                  </p>
                  <button className="comic-btn comic-btn-primary result-btn" onClick={reset}>
                    <RotateCcw size={16} strokeWidth={3} /> Kembali
                  </button>
                </motion.div>
              )}

              {/* ERROR */}
              {status === 'error' && (
                <motion.div key="err" className="absensi-result absensi-result--error comic-card"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="result-icon">❌</div>
                  <h2 className="result-title">GAGAL!</h2>
                  <p className="result-sub">{errMsg || 'Terjadi kesalahan. Coba lagi.'}</p>
                  <button className="comic-btn comic-btn-primary result-btn" onClick={reset}>
                    <RotateCcw size={16} strokeWidth={3} /> Coba Lagi
                  </button>
                </motion.div>
              )}

              {/* FORM */}
              {(status === 'idle' || status === 'loading') && (
                <motion.form
                  key="form"
                  className="absensi-form comic-card"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="absensi-form__header">
                    <span className="comic-badge" style={{ background: 'var(--color-panel-1)' }}>
                      📋 Form Absensi Harian
                    </span>
                    <h2 className="absensi-form__title">Isi Data Kamu!</h2>
                  </div>

                  {/* Alert if closed */}
                  {!open && (
                    <div className="absensi-alert">
                      <AlertTriangle size={18} strokeWidth={3} />
                      <span>Absensi belum/sudah berakhir. Tetap isi untuk uji coba.</span>
                    </div>
                  )}

                  {/* Name select */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="nama-select">Pilih Namamu 👤</label>
                    <select
                      id="nama-select"
                      className="form-select"
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      required
                    >
                      <option value="">— Pilih Nama —</option>
                      {members.map(m => (
                        <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* NIM (auto-filled, read-only) */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="nim-input">NIM 🎓</label>
                    <input
                      id="nim-input"
                      type="text"
                      className="form-input"
                      value={nim}
                      onChange={e => setNim(e.target.value)}
                      placeholder="NIM otomatis terisi"
                      required
                    />
                    {nim && alreadySubmitted() && (
                      <p className="form-hint form-hint--warn">
                        ⚠️ Kamu sudah absen hari ini!
                      </p>
                    )}
                  </div>

                  {/* Info row */}
                  <div className="form-info-row">
                    <span>📅 {fmtDate(wib)}</span>
                    {inKKN && <span>🏕️ Hari ke-{kkDay}</span>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`comic-btn absensi-submit-btn ${open ? 'comic-btn-primary' : 'comic-btn-accent'}`}
                    disabled={status === 'loading' || !nama}
                  >
                    {status === 'loading' ? (
                      <><span className="btn-spinner" /> Mengirim...</>
                    ) : (
                      <><Send size={20} strokeWidth={3} /> {open ? '✋ ABSEN SEKARANG!' : '📤 Kirim Absensi'}</>
                    )}
                  </button>

                  <p className="form-disclaimer">
                    <XCircle size={12} strokeWidth={3} /> Absensi hanya bisa dilakukan 1x/hari pukul 07:00–08:00 WIB
                  </p>
                </motion.form>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── RULES ── */}
      <section className="section-padding halftone-bg" style={{ borderTop: 'var(--border)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="comic-badge" style={{ background: 'var(--color-panel-4)', marginBottom: '12px', display: 'inline-flex' }}>📜 Tata Tertib</span>
            <h2 className="section-title section-title-underline">Aturan Absensi!</h2>
          </div>
          <div className="rules-grid">
            {[
              { icon: '⏰', title: 'Jam Absensi', desc: 'Hanya bisa absen pukul 07:00 – 08:00 WIB setiap harinya.' },
              { icon: '1️⃣', title: '1x Per Hari', desc: 'Setiap anggota hanya bisa melakukan 1x absensi per hari.' },
              { icon: '📅', title: 'Periode KKN', desc: 'Absensi aktif selama 21 Juli – 25 Agustus 2026 (36 hari).' },
              { icon: '📊', title: 'Rekap Otomatis', desc: 'Data tersimpan ke Google Sheets, bisa dilihat DPL kapan saja.' },
            ].map((r, i) => (
              <motion.div key={i} className="rule-card comic-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="rule-icon">{r.icon}</div>
                <h3 className="rule-title">{r.title}</h3>
                <p className="rule-desc">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Absensi;
