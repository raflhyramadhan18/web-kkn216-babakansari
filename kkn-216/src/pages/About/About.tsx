import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MapPin, Users, Calendar } from 'lucide-react';
import './About.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const About: React.FC = () => {
  return (
    <div className="about-page" style={{ paddingTop: '72px' }}>
      {/* Page Header */}
      <section className="page-header" style={{ background: 'var(--color-primary)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span
            className="comic-badge"
            style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          >
            📌 Profil
          </motion.span>
          <motion.h1
            className="page-header__title"
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            TENTANG KAMI!
          </motion.h1>
          <motion.p className="page-header__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Mengenal lebih dekat KKN 216 & Desa Babakansari
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">ABOUT!</div>
      </section>

      {/* Tentang Desa */}
      <section className="section-padding">
        <div className="container about-grid">
          <motion.div className="about-img-wrap" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="comic-card about-logo-card">
              <img src="/734622969_18159090112426253_7593957458933089080_n.jpg" alt="Logo Desa Babakansari" className="about-logo" />
            </div>
            <div className="about-info-card comic-card">
              <ul className="about-info-list">
                <li><MapPin size={16} strokeWidth={3} /> <span>Desa Babakansari, Kec. Sukaluyu</span></li>
                <li><Users size={16} strokeWidth={3} /> <span>Kabupaten Cianjur, Jawa Barat</span></li>
                <li><Calendar size={16} strokeWidth={3} /> <span>Kode Pos 43283</span></li>
              </ul>
            </div>
          </motion.div>

          <motion.div className="about-content" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <span className="comic-badge" style={{ background: 'var(--color-panel-1)', marginBottom: '12px', display: 'inline-flex' }}>🏘️ Desa Babakansari</span>
            <h2 className="section-title section-title-underline" style={{ marginBottom: '20px' }}>Mengenal Desa</h2>
            <p className="about-text">
              <strong>Desa Babakansari</strong> adalah sebuah desa yang terletak di Kecamatan Sukaluyu, Kabupaten Cianjur, Jawa Barat. Dikelilingi hamparan sawah dan perbukitan hijau yang indah, desa ini menyimpan potensi besar di bidang pertanian, UMKM, dan kebudayaan lokal.
            </p>
            <p className="about-text" style={{ marginTop: '16px' }}>
              Dengan jumlah penduduk sekitar 3.200 jiwa yang tersebar di beberapa dusun, warga Desa Babakansari dikenal ramah dan gotong royong. Berbagai potensi lokal menjadi fokus pengembangan bersama tim KKN 216.
            </p>
            <div className="about-highlights">
              {['Pertanian Organik', 'UMKM Lokal', 'Wisata Alam', 'Budaya Sunda'].map((item) => (
                <span key={item} className="comic-badge about-highlight-badge" style={{ background: 'var(--color-panel-2)' }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="about-divider" />

      {/* Tentang Kelompok */}
      <section className="section-padding" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="comic-badge" style={{ background: 'var(--color-panel-4)' }}>🎓 Kelompok KKN</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px auto 8px', display: 'block' }}>
              KKN 216!
            </h2>
            <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)' }}>
              UIN Sunan Gunung Djati Bandung — Juli–Agustus 2026
            </p>
          </div>

          <div className="kelompok-grid">
            {[
              { icon: '🎯', title: 'Visi', text: 'Menjadi agen perubahan yang mampu berkontribusi nyata bagi masyarakat Desa Babakansari melalui pengabdian berbasis ilmu pengetahuan dan nilai-nilai Islam.' },
              { icon: '🚀', title: 'Misi', text: 'Melaksanakan program kerja inovatif yang berorientasi pada pemberdayaan masyarakat, peningkatan kualitas hidup, dan pembangunan desa yang berkelanjutan.' },
              { icon: '💡', title: 'Nilai', text: 'Kami menjunjung tinggi nilai kejujuran, kerja keras, kolaborasi, dan kebermanfaatan. Setiap program dirancang dengan memperhatikan kebutuhan nyata warga.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="kelompok-card comic-card"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="kelompok-card__icon">{item.icon}</div>
                <h3 className="kelompok-card__title">{item.title}</h3>
                <p className="kelompok-card__text">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DPL Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="comic-badge" style={{ background: 'var(--color-panel-3)' }}>👨‍🏫 Pembimbing</span>
            <h2 className="section-title section-title-underline" style={{ margin: '12px auto 8px', display: 'block' }}>
              Dosen Pembimbing!
            </h2>
          </div>

          <motion.div
            className="dpl-card comic-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Photo */}
            <div className="dpl-photo-wrap">
              <img
                src="/dpl-photo-placeholder.png"
                alt="Foto DPL KKN 216"
                className="dpl-photo"
              />
            </div>

            {/* Info */}
            <div className="dpl-info">
              <span className="comic-badge" style={{ background: 'var(--color-panel-3)', marginBottom: '12px', display: 'inline-flex' }}>
                👨‍🏫 Dosen Pembimbing Lapangan
              </span>
              <h3 className="dpl-name">Dr. [Nama DPL], M.Pd.</h3>
              <p className="dpl-title">Dosen Pembimbing Lapangan KKN 216</p>
              <span className="comic-badge" style={{ background: 'var(--color-panel-1)', marginTop: '12px', display: 'inline-flex' }}>
                🎓 UIN Sunan Gunung Djati Bandung
              </span>
              <div className="dpl-divider" />
              <p className="dpl-quote">
                "Foto dan informasi lengkap DPL akan diperbarui segera. Terima kasih atas bimbingannya selama KKN 216 di Desa Babakansari! 💪"
              </p>
              <div className="dpl-contact">
                <span className="dpl-contact-item">📧 email@uinsgd.ac.id</span>
                <span className="dpl-contact-item">📱 +62 xxx-xxxx-xxxx</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
