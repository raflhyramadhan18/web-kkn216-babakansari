import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Camera, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { members } from '../../data/members';
import './Logbook.css';

interface LogData {
  nama: string;
  nim: string;
  tanggal: string;
  kegiatan: string;
  deskripsi: string;
  fotoUrl: string;
}

const Logbook: React.FC = () => {
  // Feed state
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [step, setStep] = useState<'pin' | 'form'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [userNama, setUserNama] = useState('');
  const [userNim, setUserNim] = useState('');

  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [fotoBase64, setFotoBase64] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logbook');
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = members.find(m => m.pin === pinInput.trim());
    if (found) {
      setUserNama(found.name);
      setUserNim(found.nim);
      setStep('form');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress image before Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG 60%
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setFotoBase64(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: userNama,
          nim: userNim,
          tanggal: formDate,
          kegiatan: formTitle,
          deskripsi: formDesc,
          foto: fotoBase64
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success === false) {
          alert('Gagal: ' + data.message);
        } else {
          setSubmitSuccess(true);
          setTimeout(() => {
            setSubmitSuccess(false);
            setFormTitle('');
            setFormDesc('');
            setFotoBase64('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchLogs(); // refresh feed
          }, 3000);
        }
      } else {
        alert('Gagal menghubungi server');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengirim logbook');
    }
    setIsSubmitting(false);
  };

  const downloadPDF = () => {
    const targetLogs = logs.filter(l => l.nama === userNama);
    if (targetLogs.length === 0) return alert('Tidak ada data logbook');

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Logbook Harian KKN 216 - ${userNama}`, 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

    const tableColumn = ["Tanggal", "Nama", "Kegiatan", "Deskripsi"];
    const tableRows = targetLogs.map(l => [
      l.tanggal,
      l.nama,
      l.kegiatan,
      l.deskripsi
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [4, 120, 87] } // Primary color
    });

    doc.save(`Logbook_KKN_${userNama.replace(/\s+/g, '_')}.pdf`);
  };

  const displayedLogs = logs.filter(l => l.nama === userNama);

  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch(e) {}
    return dateStr;
  };

  return (
    <div className="logbook-page" style={{ paddingTop: '72px' }}>
      <section className="page-header" style={{ background: 'var(--color-primary)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '16px' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            📖 Jurnal Harian
          </motion.span>
          <motion.h1 className="page-header__title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            LOGBOOK KKN
          </motion.h1>
          <p className="page-header__sub">Catat dan pantau kegiatan harian setiap anggota KKN 216.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container logbook-grid">
          
          {/* ── LEFT COL: FORM ── */}
          <div className="logbook-form-col">
            <div className="comic-card logbook-form-card">
              <div className="section-header">
                <h3 className="section-title section-title-underline" style={{ fontSize: '1.5rem' }}>Isi Logbook</h3>
              </div>

              {step === 'pin' ? (
                <form onSubmit={handlePinSubmit} className="pin-form">
                  <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Masukkan PIN rahasia untuk mengisi logbook.
                  </p>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="****"
                    className={`comic-input pin-input ${pinError ? 'pin-error' : ''}`}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                  {pinError && <p className="error-text">PIN Salah!</p>}
                  <button type="submit" className="comic-btn comic-btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                    Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--color-bg)', borderRadius: '8px', border: '2px solid var(--color-border)' }}>
                    <p style={{ margin: 0, fontWeight: 800 }}>👤 {userNama}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>NIM: {userNim}</p>
                  </div>

                  {submitSuccess ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                      <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Berhasil Disimpan!</h4>
                    </motion.div>
                  ) : (
                    <>
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Tanggal Kegiatan</label>
                        <input type="date" className="comic-input" value={formDate} onChange={e => setFormDate(e.target.value)} required />
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Nama Kegiatan</label>
                        <input type="text" className="comic-input" placeholder="Contoh: Mengajar SD" value={formTitle} onChange={e => setFormTitle(e.target.value)} required />
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Deskripsi Lengkap</label>
                        <textarea className="comic-input" placeholder="Ceritakan apa saja yang dilakukan..." rows={4} value={formDesc} onChange={e => setFormDesc(e.target.value)} required />
                      </div>

                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label"><Camera size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Foto Kegiatan (Opsional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="comic-input" style={{ padding: '8px' }} />
                        {fotoBase64 && <img src={fotoBase64} alt="Preview" className="logbook-photo-preview" />}
                      </div>

                      <button type="submit" className="comic-btn comic-btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Mengunggah...' : <><Upload size={16} /> Simpan Logbook</>}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* ── RIGHT COL: FEED ── */}
          <div className="logbook-feed-col">
            {step === 'pin' ? (
              <div className="comic-card" style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5' }}>
                <p>Silakan login untuk melihat logbook Anda.</p>
              </div>
            ) : (
              <>
                <div className="logbook-filters" style={{ justifyContent: 'flex-end', marginBottom: '16px', display: 'flex' }}>
                  <button className="comic-btn comic-btn-secondary" onClick={downloadPDF} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <Download size={16} /> Export PDF
                  </button>
                </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</div>
            ) : displayedLogs.length === 0 ? (
              <div className="comic-card" style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5' }}>
                <p>Belum ada logbook yang diisi.</p>
              </div>
            ) : (
              <div className="logbook-feed">
                {displayedLogs.map((log, idx) => (
                  <motion.div key={idx} className="comic-card logbook-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    {log.fotoUrl && (
                      <img src={getDirectImageUrl(log.fotoUrl)} alt="Kegiatan" className="logbook-item__photo" />
                    )}
                    <div className="logbook-item__content">
                      <h3 className="logbook-item__title">{log.kegiatan}</h3>
                      <div className="logbook-item__meta">
                        <span className="comic-badge" style={{ background: 'var(--color-secondary)', fontSize: '0.7rem' }}>{formatDisplayDate(log.tanggal)}</span>
                        <span>👤 {log.nama}</span>
                      </div>
                      <p className="logbook-item__desc">{log.deskripsi}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Logbook;
