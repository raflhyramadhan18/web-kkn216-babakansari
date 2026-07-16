import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import './Gallery.css';

const categories = ['Semua', 'Pendidikan', 'Lingkungan', 'Kesehatan', 'Teknologi', 'UMKM', 'Keagamaan', 'Sosial', 'Infrastruktur'];

const galleryItems = [
  { id: 1, emoji: '📚', label: 'Bimbingan Belajar', desc: 'Sesi bimbel anak-anak SD Babakansari', category: 'Pendidikan', color: '#d1fae5' },
  { id: 2, emoji: '🌱', label: 'Penanaman Pohon', desc: 'Kegiatan penghijauan bersama warga', category: 'Lingkungan', color: '#a7f3d0' },
  { id: 3, emoji: '🏥', label: 'Posyandu Gratis', desc: 'Cek kesehatan untuk lansia & ibu hamil', category: 'Kesehatan', color: '#fee2e2' },
  { id: 4, emoji: '📱', label: 'Workshop Digital', desc: 'Pelatihan media sosial untuk UMKM', category: 'Teknologi', color: '#ede9fe' },
  { id: 5, emoji: '🛒', label: 'Bazaar UMKM', desc: '40+ stand produk lokal Babakansari', category: 'UMKM', color: '#fef9c3' },
  { id: 6, emoji: '🕌', label: 'Pendampingan TPA', desc: 'Mengajar Al-Quran di masjid desa', category: 'Keagamaan', color: '#fff7ed' },
  { id: 7, emoji: '🎭', label: 'Festival Budaya', desc: 'Penampilan seni jaipong & pencak silat', category: 'Sosial', color: '#fce7f3' },
  { id: 8, emoji: '🏗️', label: 'Revitalisasi Balai', desc: 'Pengecatan & mural balai desa', category: 'Infrastruktur', color: '#e0f2fe' },
  { id: 9, emoji: '♻️', label: 'Bank Sampah', desc: 'Peluncuran bank sampah desa', category: 'Lingkungan', color: '#a7f3d0' },
  { id: 10, emoji: '🏷️', label: 'Branding UMKM', desc: 'Pembuatan logo & kemasan produk', category: 'UMKM', color: '#fef9c3' },
  { id: 11, emoji: '🧼', label: 'Penyuluhan PHBS', desc: 'Demo cuci tangan di sekolah', category: 'Kesehatan', color: '#fee2e2' },
  { id: 12, emoji: '📖', label: 'Pojok Baca', desc: 'Peresmian pojok baca desa', category: 'Pendidikan', color: '#d1fae5' },
  { id: 13, emoji: '🌐', label: 'Website Desa', desc: 'Launching website profil desa', category: 'Teknologi', color: '#ede9fe' },
  { id: 14, emoji: '🤲', label: 'Malam Keagamaan', desc: 'Istigasah bersama 200+ jamaah', category: 'Keagamaan', color: '#fff7ed' },
  { id: 15, emoji: '🤝', label: 'Kerja Bakti', desc: 'Gotong royong bersama warga desa', category: 'Sosial', color: '#fce7f3' },
  { id: 16, emoji: '🪧', label: 'Plang Desa', desc: 'Pemasangan penunjuk jalan', category: 'Infrastruktur', color: '#e0f2fe' },
  { id: 17, emoji: '🎓', label: 'Pembukaan KKN', desc: 'Upacara penerimaan di balai desa', category: 'Sosial', color: '#fce7f3' },
  { id: 18, emoji: '🏆', label: 'Penutupan KKN', desc: 'Acara perpisahan yang mengharukan', category: 'Sosial', color: '#fce7f3' },
  { id: 19, emoji: '🌳', label: '500 Bibit Pohon', desc: 'Semua bibit berhasil ditanam!', category: 'Lingkungan', color: '#a7f3d0' },
  { id: 20, emoji: '👨‍👩‍👧', label: 'Foto Bersama', desc: 'Kenangan bersama warga desa', category: 'Sosial', color: '#fce7f3' },
  { id: 21, emoji: '🍱', label: 'Masak Bersama', desc: 'Masak makanan tradisional bersama ibu PKK', category: 'Sosial', color: '#fce7f3' },
  { id: 22, emoji: '🎨', label: 'Mural Desa', desc: 'Karya mural inspiratif di balai desa', category: 'Infrastruktur', color: '#e0f2fe' },
  { id: 23, emoji: '📊', label: 'Presentasi', desc: 'Presentasi program kepada perangkat desa', category: 'Teknologi', color: '#ede9fe' },
  { id: 24, emoji: '🌅', label: 'Hari Terakhir', desc: 'Momen terakhir di Desa Babakansari', category: 'Sosial', color: '#fce7f3' },
];

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null);

  const filtered = activeFilter === 'Semua'
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeFilter);

  return (
    <div className="gallery-page" style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section className="page-header" style={{ background: 'var(--color-purple)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            📸 Galeri Foto
          </motion.span>
          <motion.h1 className="page-header__title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            GALERI!
          </motion.h1>
          <motion.p className="page-header__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Kenangan 40 hari mengabdi di Desa Babakansari
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">FOTO!</div>
      </section>

      {/* Filter */}
      <section className="filter-section halftone-bg">
        <div className="container">
          <div className="filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="gallery-count-row">
            <span className="comic-badge" style={{ background: 'var(--color-panel-1)' }}>
              📷 {filtered.length} Foto
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="gallery-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={`gallery-item comic-card ${i % 7 === 0 ? 'gallery-item--wide' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i % 8) * 0.05, duration: 0.35 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  onClick={() => setSelected(item)}
                  style={{ background: item.color, cursor: 'pointer' }}
                >
                  <div className="gallery-item__inner">
                    <span className="gallery-item__emoji">{item.emoji}</span>
                    <p className="gallery-item__label">{item.label}</p>
                    <div className="gallery-item__hover-overlay">
                      <ZoomIn size={24} strokeWidth={3} color="#fff" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="gallery-note comic-card" style={{ background: 'var(--color-panel-2)', marginTop: '40px' }}>
            <span>📢</span>
            <p><strong>Info:</strong> Foto nyata dari kegiatan akan segera ditambahkan. Saat ini menampilkan preview konten.</p>
          </div>
        </div>
      </section>

      {/* Custom Modal Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="gallery-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="gallery-modal comic-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: selected.color }}
            >
              <button className="gallery-modal__close" onClick={() => setSelected(null)}>
                <X size={24} strokeWidth={3} />
              </button>
              <div className="gallery-modal__emoji">{selected.emoji}</div>
              <h3 className="gallery-modal__title">{selected.label}</h3>
              <p className="gallery-modal__desc">{selected.desc}</p>
              <span className="comic-badge" style={{ background: '#fff', alignSelf: 'center' }}>
                {selected.category}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
