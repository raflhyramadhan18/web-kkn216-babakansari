import React from 'react';
import { motion } from 'framer-motion';
import { timelineEvents, kknStats } from '../../data/timeline';
import './Timeline.css';

const categoryColors: Record<string, string> = {
  'Umum': '#6b7280',
  'Pendidikan & Literasi': '#10b981',
  'Lingkungan & Pertanian': '#059669',
  'Kesehatan Masyarakat': '#ef4444',
  'Digitalisasi & Teknologi': '#7c3aed',
  'Ekonomi & UMKM': '#d97706',
  'Keagamaan': '#ea580c',
  'Sosial & Kebudayaan': '#db2777',
  'Infrastruktur Desa': '#0284c7',
};

const weeks = [1, 2, 3, 4, 5, 6];

const Timeline: React.FC = () => {
  return (
    <div className="timeline-page" style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section className="page-header" style={{ background: '#d97706' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            📅 Kronologi
          </motion.span>
          <motion.h1 className="page-header__title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            TIMELINE!
          </motion.h1>
          <motion.p className="page-header__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            40 hari penuh cerita — {kknStats.startDate} s/d {kknStats.endDate}
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">DAY!</div>
      </section>

      {/* Stats bar */}
      <section className="timeline-statsbar halftone-bg">
        <div className="container">
          <div className="timeline-statsbar__grid">
            <div className="timeline-statitem">📅 <strong>40 Hari</strong> Pengabdian</div>
            <div className="timeline-statitem">📋 <strong>21 Kegiatan</strong> Tercatat</div>
            <div className="timeline-statitem">🗓️ <strong>6 Minggu</strong> Penuh Makna</div>
            <div className="timeline-statitem">🤝 <strong>1.200+</strong> Warga Terlibat</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container">
          {weeks.map((week) => {
            const weekEvents = timelineEvents.filter((e) => e.week === week);
            if (weekEvents.length === 0) return null;
            return (
              <div key={week} className="timeline-week">
                <motion.div
                  className="timeline-week__header"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="timeline-week__badge comic-badge" style={{ background: 'var(--color-secondary)', fontSize: 'var(--text-xl)' }}>
                    Minggu {week}
                  </div>
                </motion.div>

                <div className="timeline-events">
                  {weekEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      className={`timeline-event ${i % 2 === 0 ? 'timeline-event--left' : 'timeline-event--right'}`}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <div className="timeline-event__connector">
                        <div
                          className="timeline-event__dot"
                          style={{ background: categoryColors[event.category] || '#6b7280' }}
                        />
                      </div>
                      <div className="timeline-event__card comic-card">
                        <div className="timeline-event__date">
                          <span>📅</span> {event.date}
                        </div>
                        <span
                          className="comic-badge timeline-event__cat"
                          style={{ background: categoryColors[event.category] || '#6b7280', color: '#fff' }}
                        >
                          {event.category}
                        </span>
                        <h3 className="timeline-event__title">{event.title}</h3>
                        <p className="timeline-event__desc">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Timeline;
