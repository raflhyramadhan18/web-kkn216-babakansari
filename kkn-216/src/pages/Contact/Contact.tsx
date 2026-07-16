import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Music2, Mail, MapPin, Phone, Send } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page" style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section className="page-header" style={{ background: 'var(--color-primary-dark)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            📞 Kontak
          </motion.span>
          <motion.h1 className="page-header__title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            HUBUNGI KAMI!
          </motion.h1>
          <motion.p className="page-header__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Ada pertanyaan atau ingin berkolaborasi? Hubungi kami!
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">HI!</div>
      </section>

      <section className="section-padding">
        <div className="container contact-grid">
          {/* Contact Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title section-title-underline" style={{ marginBottom: '32px' }}>Info Kontak!</h2>

            <div className="contact-cards">
              {[
                { icon: <MapPin size={24} strokeWidth={3} />, label: 'Lokasi', value: 'Desa Babakansari, Kec. Sukaluyu, Kab. Cianjur', color: 'var(--color-panel-1)' },
                { icon: <Mail size={24} strokeWidth={3} />, label: 'Email', value: 'kkn216babakansari@gmail.com', color: 'var(--color-panel-3)' },
                { icon: <Phone size={24} strokeWidth={3} />, label: 'Ketua', value: '+62 812-xxxx-xxxx', color: 'var(--color-panel-2)' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="contact-card comic-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: item.color }}
                >
                  <div className="contact-card__icon">{item.icon}</div>
                  <div>
                    <p className="contact-card__label">{item.label}</p>
                    <p className="contact-card__value">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social media */}
            <div style={{ marginTop: '32px' }}>
              <h3 className="section-title" style={{ fontSize: 'var(--text-3xl)', marginBottom: '16px' }}>Media Sosial!</h3>
              <div className="social-links">
                <a href="https://instagram.com/kkn.216.babakansari" target="_blank" rel="noopener noreferrer" className="social-link-btn comic-btn comic-btn-outline">
                  <ExternalLink size={20} strokeWidth={3} />
                  Instagram: @kkn.216.babakansari
                </a>
                <a href="https://tiktok.com/@kkn.216.babakansari" target="_blank" rel="noopener noreferrer" className="social-link-btn comic-btn comic-btn-outline">
                  <Music2 size={20} strokeWidth={3} />
                  TikTok: @kkn.216.babakansari
                </a>
              </div>
            </div>

            {/* Closing */}
            <motion.div
              className="closing-note speech-bubble"
              style={{ background: 'var(--color-secondary)', marginTop: '32px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p>
                💚 <strong>Terima kasih</strong> kepada seluruh warga Desa Babakansari atas sambutan hangat, kerja sama yang luar biasa, dan kenangan indah yang tak terlupakan. KKN 216 selalu ada di hati!
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="contact-form-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="comic-card contact-form-card">
              <h3 className="section-title" style={{ fontSize: 'var(--text-3xl)', marginBottom: '24px' }}>Kirim Pesan!</h3>

              {sent ? (
                <motion.div
                  className="form-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <span>🎉</span>
                  <h4>Pesan Terkirim!</h4>
                  <p>Terima kasih! Kami akan segera membalas pesanmu.</p>
                  <button className="comic-btn comic-btn-primary" style={{ marginTop: '16px' }} onClick={() => setSent(false)}>
                    Kirim Lagi
                  </button>
                </motion.div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nama kamu..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pesan</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Tulis pesanmu di sini..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                  <button type="submit" className="comic-btn comic-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Send size={18} strokeWidth={3} />
                    Kirim Pesan!
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Thank you section */}
      <section className="thankyou-section section-padding halftone-bg" style={{ borderTop: 'var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h2
            className="section-title"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--color-primary)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            TERIMA KASIH! 💚
          </motion.h2>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', marginTop: '16px', color: 'var(--color-text-muted)' }}>
            Desa Babakansari, kenangan kami seumur hidup 🌿
          </p>
          <div className="thankyou-deco" aria-hidden="true">
            <span>🌟</span><span>💚</span><span>🌿</span><span>💛</span><span>🌟</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
