import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import { members } from '../../data/members';
import './Absensi.css';

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */
const KKN_START = new Date('2026-07-22T00:00:00+07:00');
const KKN_END   = new Date('2026-08-25T23:59:59+07:00');
const OPEN_H    = 6;  // 06:xx WIB
const CLOSE_H   = 7;  // 07:xx WIB

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
   Sound Effects (Web Audio API)
───────────────────────────────── */
function playSound(type: 'success' | 'error' | 'locked') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'locked') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(250, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
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
// Two-step flow: 'pin' = entering PIN, 'confirmed' = identity verified
type Step = 'pin' | 'confirmed';

const Absensi: React.FC = () => {
  const [wib, setWib]           = useState(getWIB());
  const [step, setStep]         = useState<Step>('pin');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinShake, setPinShake] = useState(false);
  // identity — locked once PIN verified
  const [nama, setNama]         = useState('');
  const [nim, setNim]           = useState('');
  const [status, setStatus]     = useState<Status>('idle');
  const [errMsg, setErrMsg]     = useState('');
  const [leaderboard, setLeaderboard] = useState<{nama: string; score: number}[]>([]);
  const [isWithinTime, setIsWithinTime] = useState(false);

  /* fetch leaderboard on mount */
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeaderboard(data);
      })
      .catch(err => console.error('Gagal fetch leaderboard', err));
  }, []);

  /* tick every second */
  useEffect(() => {
    const id = setInterval(() => setWib(getWIB()), 1000);
    return () => clearInterval(id);
  }, []);

  const alreadySubmitted = useCallback(() => {
    if (!nim) return false;
    const key = `kkn216_absen_${nim}_${getDateKey(wib)}`;
    return !!localStorage.getItem(key);
  }, [nim, wib]);

  // OVERRIDE FOR TESTING: ALWAYS ALLOW
  const open  = true; // isWindowOpen(wib);
  const inKKN = true; // isKKNPeriod(wib);
  const kkDay = 1;    // inKKN ? getKKNDay(wib) : 0;

  /* ── Step 1: verify PIN ── */
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = members.find(m => m.pin === pinInput.trim());
    if (!found) {
      // wrong pin — shake animation
      setPinError(true);
      setPinShake(true);
      setPinInput('');
      playSound('error');
      setTimeout(() => setPinShake(false), 500);
      return;
    }
    // correct!
    setPinError(false);
    setNama(found.name);
    setNim(found.nim);
    setStep('confirmed');
  };

  /* ── Step 2: submit attendance ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nim) return;

    // ⚡ Period check DISABLED during testing — enable on go-live by uncommenting:
    if (!inKKN) { setStatus('outside-kkn'); playSound('locked'); return; }

    if (!open)            { setStatus('closed'); playSound('locked'); return; }
    if (alreadySubmitted()) { setStatus('duplicate'); playSound('locked'); return; }

    setStatus('loading');

    const hariKe = inKKN ? kkDay : 0;
    const payload = { nama, nim, tanggal: fmtDate(wib), waktu: fmtTime(wib), hariKe };

    try {
      let success = false;

      if (GAS_URL) {
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
        success = true;
      } else {
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
        localStorage.setItem(`kkn216_absen_${nim}_${getDateKey(wib)}`, fmtTime(wib));
        setStatus('success');
        playSound('success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setErrMsg(msg);
      setStatus('error');
      playSound('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrMsg('');
    // back to PIN step for security
    setStep('pin');
    setPinInput('');
    setNama('');
    setNim('');
  };

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
              <div className="status-card__window">Jam absensi: 06:00 – 07:00 WIB</div>
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

            {/* Leaderboard Absensi (Si Paling Pagi) */}
            <motion.div className="leaderboard-card comic-card"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
              <div className="leaderboard-header">
                <span className="leaderboard-icon">🏆</span>
                <h3 className="leaderboard-title">Top 3 Si Paling Pagi</h3>
              </div>
              <ul className="leaderboard-list">
                {leaderboard.length === 0 ? (
                  <p className="leaderboard-note" style={{ textAlign: 'center', marginTop: '16px' }}>Belum ada data</p>
                ) : (
                  leaderboard.map((lb, idx) => (
                    <li key={idx} className="leaderboard-item">
                      <span className="leaderboard-rank" style={{ 
                        background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32', 
                        color: idx === 2 ? '#fff' : '#000' 
                      }}>{idx + 1}</span>
                      <span className="leaderboard-name">{lb.nama.split(' ')[0]}</span>
                      <span className="leaderboard-time">{lb.score} Poin</span>
                    </li>
                  ))
                )}
              </ul>
              <p className="leaderboard-note">*Diperbarui secara real-time dari Google Sheets</p>
            </motion.div>
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
                  <p className="result-sub">Kamu sudah absen hari ini. Sampai besok jam 06:00!</p>
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
                      ? 'Absensi hanya tersedia 22 Juli – 25 Agustus 2026.'
                      : `Absensi dibuka pukul 06:00 – 07:00 WIB. Sekarang ${fmtTime(wib)}.`}
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

              {/* FORM ─ Step 1: PIN */}
              {step === 'pin' && (status === 'idle' || status === 'loading') && (
                <motion.form
                  key="pin-form"
                  className={`absensi-form comic-card${pinShake ? ' pin-shake' : ''}`}
                  onSubmit={handlePinSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="absensi-form__header">
                    <span className="comic-badge" style={{ background: 'var(--color-panel-4)' }}>
                      🔐 Verifikasi Identitas
                    </span>
                    <h2 className="absensi-form__title">Masukkan PIN Kamu!</h2>
                    <p className="pin-hint">Setiap anggota punya PIN unik. PIN hanya kamu yang tahu.</p>
                  </div>

                  {/* Alert if closed */}
                  {!open && (
                    <div className="absensi-alert">
                      <AlertTriangle size={18} strokeWidth={3} />
                      <span>Absensi belum/sudah berakhir. Tetap isi untuk uji coba.</span>
                    </div>
                  )}

                  {/* PIN input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="pin-input">🔢 PIN Kamu (4 digit)</label>
                    <input
                      id="pin-input"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      className={`form-input pin-input${pinError ? ' form-input--error' : ''}`}
                      value={pinInput}
                      onChange={e => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(false); }}
                      placeholder="••••"
                      autoComplete="off"
                      required
                    />
                    {pinError && (
                      <p className="form-hint form-hint--error">
                        ❌ PIN salah! Coba lagi atau hubungi Ketua.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="comic-btn comic-btn-primary absensi-submit-btn"
                    disabled={pinInput.length < 4}
                  >
                    🔓 Verifikasi PIN
                  </button>

                  <p className="form-disclaimer">
                    <XCircle size={12} strokeWidth={3} /> PIN bersifat rahasia. Jangan berikan ke orang lain!
                  </p>
                </motion.form>
              )}

              {/* FORM ─ Step 2: Confirm & Submit */}
              {step === 'confirmed' && (status === 'idle' || status === 'loading') && (
                <motion.form
                  key="absen-form"
                  className="absensi-form comic-card"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                >
                  <div className="absensi-form__header">
                    <span className="comic-badge" style={{ background: 'var(--color-panel-1)' }}>
                      ✅ Identitas Terverifikasi
                    </span>
                    <h2 className="absensi-form__title">Konfirmasi Absensi!</h2>
                  </div>

                  {/* Alert if closed */}
                  {!open && (
                    <div className="absensi-alert">
                      <AlertTriangle size={18} strokeWidth={3} />
                      <span>Absensi belum/sudah berakhir. Tetap isi untuk uji coba.</span>
                    </div>
                  )}

                  {/* Identity locked card */}
                  <div className="identity-card">
                    <div className="identity-card__avatar">👤</div>
                    <div className="identity-card__info">
                      <div className="identity-card__name">{nama}</div>
                      <div className="identity-card__nim">NIM: {nim}</div>
                      <div className="identity-card__lock">🔒 Identitas terkunci</div>
                    </div>
                  </div>

                  {/* duplicate warning */}
                  {alreadySubmitted() && (
                    <p className="form-hint form-hint--warn">
                      ⚠️ Kamu sudah absen hari ini!
                    </p>
                  )}

                  {/* Info row */}
                  <div className="form-info-row">
                    <span>📅 {fmtDate(wib)}</span>
                    {inKKN && <span>🏕️ Hari ke-{kkDay}</span>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`comic-btn absensi-submit-btn ${open ? 'comic-btn-primary' : 'comic-btn-accent'}`}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <><span className="btn-spinner" /> Mengirim...</>
                    ) : (
                      <><Send size={20} strokeWidth={3} /> {open ? '✋ ABSEN SEKARANG!' : '📤 Kirim Absensi'}</>
                    )}
                  </button>

                  <p className="form-disclaimer">
                    <XCircle size={12} strokeWidth={3} /> Absensi hanya bisa dilakukan 1x/hari pukul 06:00–07:00 WIB
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
              { icon: '⏰', title: 'Jam Absensi', desc: 'Hanya bisa absen pukul 06:00 – 07:00 WIB setiap harinya.' },
              { icon: '1️⃣', title: '1x Per Hari', desc: 'Setiap anggota hanya bisa melakukan 1x absensi per hari.' },
              { icon: '📅', title: 'Periode KKN', desc: 'Absensi aktif selama 22 Juli – 25 Agustus 2026 (35 hari).' },
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
