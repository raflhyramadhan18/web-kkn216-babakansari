import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { programs, programCategories } from '../../data/programs';
import './Programs.css';

const categoryColors: Record<string, { bg: string; badge: string }> = {
  'Pendidikan & Literasi':    { bg: '#d1fae5', badge: '#10b981' },
  'Lingkungan & Pertanian':  { bg: '#a7f3d0', badge: '#059669' },
  'Kesehatan Masyarakat':    { bg: '#fee2e2', badge: '#ef4444' },
  'Digitalisasi & Teknologi':{ bg: '#ede9fe', badge: '#7c3aed' },
  'Ekonomi & UMKM':          { bg: '#fef9c3', badge: '#d97706' },
  'Keagamaan':               { bg: '#fff7ed', badge: '#ea580c' },
  'Sosial & Kebudayaan':     { bg: '#fce7f3', badge: '#db2777' },
  'Infrastruktur Desa':      { bg: '#e0f2fe', badge: '#0284c7' },
};

const Programs: React.FC = () => {
  const [active, setActive] = useState<string>('Semua');

  const filtered = active === 'Semua'
    ? programs
    : programs.filter((p) => p.category === active);

  return (
    <div className="programs-page" style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section className="page-header" style={{ background: 'var(--color-accent)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            📋 Program Kerja
          </motion.span>
          <motion.h1 className="page-header__title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            PROGRAM KERJA!
          </motion.h1>
          <motion.p className="page-header__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            16 Program Kerja di 8 Bidang — Semua demi Babakansari!
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">PROKER!</div>
      </section>

      {/* Filter */}
      <section className="filter-section halftone-bg">
        <div className="container">
          <div className="filter-bar">
            {programCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${active === cat ? 'filter-btn--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="programs-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((prog, i) => {
                const colors = categoryColors[prog.category] || { bg: '#f3f4f6', badge: '#6b7280' };
                return (
                  <motion.div
                    key={prog.id}
                    className="program-card comic-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    style={{ background: colors.bg }}
                  >
                    <div className="program-card__header">
                      <span className="program-card__icon">{prog.icon}</span>
                      <span className="comic-badge program-card__cat" style={{ background: colors.badge, color: '#fff' }}>
                        {prog.category}
                      </span>
                    </div>
                    <h3 className="program-card__title">{prog.title}</h3>
                    <p className="program-card__desc">{prog.description}</p>
                    {prog.highlights && (
                      <ul className="program-card__highlights">
                        {prog.highlights.map((h) => (
                          <li key={h}>
                            <CheckCircle size={14} strokeWidth={3} color="var(--color-primary-dark)" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="program-card__footer">
                      <span className="prog-status">
                        <span className="status-dot status-dot--selesai" /> Selesai
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="empty-state">
              <span>🔍</span>
              <p>Tidak ada program di kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
