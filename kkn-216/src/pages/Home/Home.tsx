import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Users, Clipboard, ChevronDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { programs } from '../../data/programs';
import { members } from '../../data/members';
import './Home.css';

/* ── animated counter hook ── */
function useCountUp(end: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return count;
}

const stats = [
  { value: 14, suffix: '', label: 'Anggota', icon: '👥', color: '#2ABF5A', bg: '#d1fae5' },
  { value: 16, suffix: '+', label: 'Program Kerja', icon: '📋', color: '#FF5733', bg: '#fee2e2' },
  { value: 40, suffix: '', label: 'Hari KKN', icon: '📅', color: '#7c3aed', bg: '#ede9fe' },
  { value: 1200, suffix: '+', label: 'Warga Terlayani', icon: '🤝', color: '#2563eb', bg: '#e0f2fe' },
];

const categoryColors: Record<string, string> = {
  'Pendidikan & Literasi': '#d1fae5',
  'Lingkungan & Pertanian': '#a7f3d0',
  'Kesehatan Masyarakat': '#fee2e2',
  'Digitalisasi & Teknologi': '#ede9fe',
  'Ekonomi & UMKM': '#fef9c3',
  'Keagamaan': '#fff7ed',
  'Sosial & Kebudayaan': '#fce7f3',
  'Infrastruktur Desa': '#e0f2fe',
};

/* ── StatCard sub-component ── */
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(stat.value, inView);
  return (
    <motion.div
      ref={ref}
      className="stat-card comic-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      style={{ borderTop: `6px solid ${stat.color}`, background: stat.bg }}
    >
      <div className="stat-card__icon">{stat.icon}</div>
      <div className="stat-card__value" style={{ color: stat.color }}>
        {count}{stat.suffix}
      </div>
      <div className="stat-card__label">{stat.label}</div>
    </motion.div>
  );
}

const Home: React.FC = () => {
  const featuredPrograms = programs.slice(0, 8);
  const featuredMembers = members.slice(0, 5);

  return (
    <div className="home">

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section className="hero">
        <div className="hero__action-lines" aria-hidden="true" />
        <div className="hero__dots" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__content">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="comic-badge hero__badge" style={{ background: '#ff5733', color: '#fff', fontSize: '13px' }}>
                ⚡ UIN Sunan Gunung Djati Bandung
              </span>
            </motion.div>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              KKN<br />
              <span className="hero__title-accent">216</span><br />
              BABAKANSARI!
            </motion.h1>

            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              🌿 Mengabdi, Belajar & Berkembang Bersama warga Desa Babakansari selama <strong>40 hari</strong> penuh semangat!
            </motion.p>

            <motion.div
              className="hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span><Calendar size={15} strokeWidth={3}/> 1 Jul – 8 Agt 2026</span>
              <span><Users size={15} strokeWidth={3}/> 14 Anggota</span>
              <span><MapPin size={15} strokeWidth={3}/> Desa Babakansari</span>
            </motion.div>

            <motion.div
              className="hero__cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Link to="/program-kerja" className="comic-btn comic-btn-primary hero__btn">
                Lihat Program Kerja <ArrowRight size={20} strokeWidth={3} />
              </Link>
              <Link to="/galeri" className="comic-btn comic-btn-secondary hero__btn">
                📸 Galeri Foto
              </Link>
            </motion.div>
          </div>

          {/* Hero visual panel */}
          <motion.div
            className="hero__panel"
            initial={{ opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero__panel-card comic-card">
              <img
                src="/734622969_18159090112426253_7593957458933089080_n.jpg"
                alt="Logo Desa Babakansari"
                className="hero__panel-logo"
              />
              <div className="hero__panel-info">
                <h3>Desa Babakansari</h3>
                <p>Kec. Sukaluyu, Kab. Cianjur, Jawa Barat</p>
              </div>
              <div className="hero__panel-badges">
                <span className="comic-badge" style={{ background: '#d1fae5' }}>📚 Pendidikan</span>
                <span className="comic-badge" style={{ background: '#fef9c3' }}>🌱 Lingkungan</span>
                <span className="comic-badge" style={{ background: '#fee2e2' }}>🏥 Kesehatan</span>
                <span className="comic-badge" style={{ background: '#ede9fe' }}>📱 Digital</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comic decoratives */}
        <div className="hero__boom" aria-hidden="true">POW!</div>
        <div className="hero__zap" aria-hidden="true">ZAP!</div>
        <div className="hero__star" aria-hidden="true">★</div>

        {/* Scroll indicator */}
        <a href="#stats" className="hero__scroll" aria-label="Scroll ke bawah">
          <ChevronDown size={24} strokeWidth={3} />
        </a>
      </section>

      {/* ═══════════════════════════════════
          STATS
      ═══════════════════════════════════ */}
      <section id="stats" className="stats-section halftone-bg">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          ABOUT PREVIEW
      ═══════════════════════════════════ */}
      <section className="about-preview section-padding">
        <div className="container about-preview__grid">
          <motion.div
            className="about-preview__visual"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-preview__img-wrap comic-card">
              <img
                src="/734622969_18159090112426253_7593957458933089080_n.jpg"
                alt="Logo Desa Babakansari"
                className="about-preview__img"
              />
            </div>
            <div className="about-preview__bubble speech-bubble">
              <p>"Bersama warga, kami membangun Babakansari yang lebih baik! 💪"</p>
            </div>
          </motion.div>

          <motion.div
            className="about-preview__content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="comic-badge" style={{ background: '#d1fae5', marginBottom: '16px', display: 'inline-flex' }}>
              📌 Tentang Kami
            </span>
            <h2 className="section-title section-title-underline" style={{ marginBottom: '20px' }}>
              Siapa Kami?
            </h2>
            <p className="about-preview__text">
              Kami adalah <strong>Kelompok KKN 216</strong> UIN Sunan Gunung Djati Bandung yang mengabdi di <strong>Desa Babakansari</strong> selama 40 hari. Dengan semangat kolektif, kami menjalankan 16 program kerja di 8 bidang demi kemajuan desa!
            </p>
            <ul className="about-preview__list">
              <li>🌿 <strong>Desa Babakansari</strong> — Lokasi Pengabdian</li>
              <li>🎓 <strong>14 Mahasiswa</strong> dari berbagai fakultas</li>
              <li>📋 <strong>16 Program Kerja</strong> di 8 bidang</li>
              <li>📅 <strong>1 Juli – 8 Agustus 2026</strong></li>
            </ul>
            <Link to="/tentang" className="comic-btn comic-btn-primary" style={{ marginTop: '24px' }}>
              Selengkapnya <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PROGRAMS PREVIEW
      ═══════════════════════════════════ */}
      <section className="programs-preview section-padding" style={{ background: '#f0fdf4', borderTop: 'var(--border)', borderBottom: 'var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="comic-badge" style={{ background: '#fef9c3' }}>📋 Program Kerja</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px 0 8px' }}>
              Proker Unggulan!
            </h2>
            <p className="section-desc">8 bidang program kerja untuk membangun Desa Babakansari</p>
          </div>

          <div className="programs-preview__grid">
            {featuredPrograms.map((prog, i) => (
              <motion.div
                key={prog.id}
                className="prog-card comic-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ background: categoryColors[prog.category] || '#fff' }}
              >
                <div className="prog-card__icon">{prog.icon}</div>
                <span className="comic-badge prog-card__badge" style={{ fontSize: '10px', background: '#fff' }}>
                  {prog.category}
                </span>
                <h3 className="prog-card__title">{prog.title}</h3>
                <p className="prog-card__desc">{prog.description.substring(0, 80)}...</p>
                <div className="prog-card__status">
                  <span className="status-dot status-dot--selesai" />
                  Selesai
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/program-kerja" className="comic-btn comic-btn-primary">
              Lihat Semua Program <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          GALLERY PREVIEW
      ═══════════════════════════════════ */}
      <section className="gallery-preview section-padding">
        <div className="container">
          <div className="section-header">
            <span className="comic-badge" style={{ background: '#fee2e2' }}>📸 Galeri</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px 0 8px' }}>
              Momen Berharga!
            </h2>
            <p className="section-desc">Kenangan indah 40 hari bersama warga Babakansari</p>
          </div>

          <div className="gallery-preview__grid">
            {[
              { emoji: '📚', label: 'Bimbel Anak', bg: '#d1fae5' },
              { emoji: '🌱', label: 'Penghijauan', bg: '#a7f3d0' },
              { emoji: '🏥', label: 'Posyandu', bg: '#fee2e2' },
              { emoji: '📱', label: 'Workshop Digital', bg: '#ede9fe' },
              { emoji: '🎭', label: 'Festival Budaya', bg: '#fce7f3' },
              { emoji: '🛒', label: 'Bazaar UMKM', bg: '#fef9c3' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="gallery-preview__item comic-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? 1.5 : -1.5 }}
                style={{ background: item.bg }}
              >
                <div className="gallery-preview__placeholder">
                  <span>{item.emoji}</span>
                  <p>{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/galeri" className="comic-btn comic-btn-accent">
              Lihat Semua Foto <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TEAM PREVIEW
      ═══════════════════════════════════ */}
      <section className="team-preview section-padding halftone-bg" style={{ borderTop: 'var(--border)', borderBottom: 'var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="comic-badge" style={{ background: '#ede9fe' }}>👥 Tim Kami</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px 0 8px' }}>
              Para Pahlawan!
            </h2>
            <p className="section-desc">14 mahasiswa berdedikasi dari UIN Sunan Gunung Djati Bandung</p>
          </div>

          <div className="team-preview__grid">
            {featuredMembers.map((member, i) => (
              <motion.div
                key={member.id}
                className="team-card comic-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.4 }}
              >
                <div className="team-card__photo-wrap">
                  <img
                    src="/photo-placeholder.png"
                    alt={`Foto ${member.name}`}
                    className="team-card__photo"
                  />
                </div>
                <div className="team-card__info">
                  <h4 className="team-card__name">{member.name}</h4>
                  <span className="comic-badge team-card__role" style={{ background: '#d1fae5', fontSize: '10px' }}>
                    {member.role}
                  </span>
                  <p className="team-card__major">{member.major}</p>
                </div>
              </motion.div>
            ))}
            {/* More card */}
            <motion.div
              className="team-card team-card--more comic-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="team-card__more-body">
                <div className="team-card__more-num">+9</div>
                <p className="team-card__more-label">Anggota lainnya</p>
                <Link to="/anggota" className="comic-btn comic-btn-primary team-card__more-btn">
                  Lihat Semua
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          MAPS SECTION
      ═══════════════════════════════════ */}
      <section className="maps-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="comic-badge" style={{ background: '#d1fae5' }}>📍 Lokasi</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px 0 8px' }}>
              Temukan Kami!
            </h2>
            <p className="section-desc">Desa Babakansari — tempat kami mengabdi selama 40 hari</p>
          </div>

          <div className="maps-wrapper">
            <div className="maps-info comic-card">
              <div className="maps-info__header">
                <span style={{ fontSize: '2.5rem' }}>📍</span>
                <div>
                  <h3 className="maps-info__title">Desa Babakansari</h3>
                  <p className="maps-info__sub">Kec. Sukaluyu, Kab. Cianjur, Jawa Barat</p>
                </div>
              </div>
              <ul className="maps-info__list">
                <li><MapPin size={16} strokeWidth={3} /><span>Desa Babakansari, Kec. Sukaluyu</span></li>
                <li><Clipboard size={16} strokeWidth={3} /><span>Kabupaten Cianjur, Jawa Barat</span></li>
                <li><Calendar size={16} strokeWidth={3} /><span>KKN berlangsung 1 Jul – 8 Agt 2026</span></li>
                <li><Users size={16} strokeWidth={3} /><span>Kode Pos: 43283</span></li>
              </ul>
              <a
                href="https://www.google.com/maps?q=-6.8378,107.2125"
                target="_blank"
                rel="noopener noreferrer"
                className="comic-btn comic-btn-primary maps-info__btn"
              >
                <MapPin size={18} strokeWidth={3} />
                Buka di Google Maps
              </a>
            </div>

            <div className="maps-embed comic-card">
              <iframe
                title="Peta Desa Babakansari"
                src="https://maps.google.com/maps?q=-6.8378,107.2125&hl=id&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════ */}
      <section className="testimonial-section section-padding" style={{ background: 'var(--color-secondary)', borderTop: 'var(--border)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="comic-badge" style={{ background: '#fff' }}>💬 Kata Mereka</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px 0 8px' }}>
              Testimonial!
            </h2>
          </div>

          <div className="testimonial-grid">
            {[
              { quote: 'Program KKN 216 sangat bermanfaat! Para mahasiswa bekerja dengan penuh semangat dan memberikan dampak nyata bagi masyarakat kami.', name: 'H. Asep Suhendar', role: 'Kepala Desa Babakansari', emoji: '🧑‍💼' },
              { quote: 'Bimbingan belajar gratis sangat membantu anak-anak kami. Mereka jadi lebih semangat belajar berkat kakak-kakak dari KKN 216!', name: 'Ibu Sari Dewi', role: 'Orang Tua Siswa', emoji: '👩' },
              { quote: 'Workshop pemasaran digital membuka mata kami. Sekarang produk UMKM kami sudah bisa dijual online!', name: 'Pak Hendra', role: 'Pelaku UMKM Lokal', emoji: '🧑‍🍳' },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card speech-bubble"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{ background: '#fff' }}
              >
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">{t.emoji}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <p>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
