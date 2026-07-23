import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, GraduationCap, Hash, Building2 } from 'lucide-react';
import { members } from '../../data/members';
import type { Member } from '../../types';
import './Team.css';

/* ── Role color map ── */
const roleColors: Record<string, { bg: string; text: string }> = {
  'Ketua':      { bg: '#2ABF5A', text: '#fff' },
  'Sekretaris': { bg: '#7C3AED', text: '#fff' },
  'Bendahara':  { bg: '#2563EB', text: '#fff' },
  'Acara':      { bg: '#EAB308', text: '#000' }, // vibrant yellow
  'PDD':        { bg: '#EC4899', text: '#fff' }, // vibrant pink
  'Logkom':     { bg: '#06B6D4', text: '#fff' }, // cyan
  'Humas':      { bg: '#EA580C', text: '#fff' },
};
const getRoleColor = (role: string) =>
  roleColors[role] ?? { bg: '#111', text: '#fff' };

/* ══════════════════════════════════
   MEMBER MODAL
   ══════════════════════════════════ */
interface ModalProps { member: Member; onClose: () => void; }

const MemberModal: React.FC<ModalProps> = ({ member, onClose }) => {
  const roleColor = getRoleColor(member.role);
  return (
    <motion.div
      className="member-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="member-modal comic-card"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button className="member-modal__close" onClick={onClose} aria-label="Tutup">
          <X size={22} strokeWidth={3} />
        </button>

        {/* Number badge */}
        <div className="member-modal__num" style={{ background: 'var(--color-primary)' }}>
          #{member.id}
        </div>

        {/* Photo */}
        <div className="member-modal__photo-wrap">
          <img
            src={member.photo}
            alt={`Foto ${member.name}`}
            className="member-modal__photo"
          />
        </div>

        {/* Info */}
        <div className="member-modal__info">
          <span
            className="comic-badge member-modal__role"
            style={{ background: roleColor.bg, color: roleColor.text }}
          >
            {member.role === 'Ketua' ? '👑 ' : ''}{member.role}
          </span>

          <h2 className="member-modal__name">{member.name}</h2>

          <ul className="member-modal__details">
            <li>
              <Hash size={15} strokeWidth={3} />
              <span><strong>NIM:</strong> {member.nim}</span>
            </li>
            <li>
              <Building2 size={15} strokeWidth={3} />
              <span>{member.faculty}</span>
            </li>
            <li>
              <GraduationCap size={15} strokeWidth={3} />
              <span>{member.major}</span>
            </li>
          </ul>

          {member.instagram && (
            <a
              href={`https://instagram.com/${member.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="comic-btn comic-btn-primary member-modal__ig"
            >
              <Link2 size={16} strokeWidth={3} />
              @{member.instagram}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════
   TEAM PAGE
   ══════════════════════════════════ */
const Team: React.FC = () => {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <div className="team-page" style={{ paddingTop: '72px' }}>

      {/* ── HEADER ── */}
      <section className="page-header" style={{ background: 'var(--color-blue)' }}>
        <div className="page-header__dots" />
        <div className="container">
          <motion.span
            className="comic-badge"
            style={{ background: 'var(--color-secondary)', marginBottom: '16px', display: 'inline-flex' }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          >
            👥 Anggota Tim
          </motion.span>
          <motion.h1 className="page-header__title"
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            ANGGOTA TIM!
          </motion.h1>
          <motion.p className="page-header__sub"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            14 mahasiswa dari UIN Sunan Gunung Djati Bandung — Klik foto untuk detail!
          </motion.p>
        </div>
        <div className="page-header__deco" aria-hidden="true">TEAM!</div>
      </section>

      {/* ── KETUA SPOTLIGHT ── */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="comic-badge" style={{ background: 'var(--color-secondary)' }}>👑 Pimpinan Kelompok</span>
          </div>

          {/* Ketua card */}
          {members.slice(0, 1).map(member => (
            <motion.div
              key={member.id}
              className="member-spotlight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelected(member)}
            >
              <div className="member-spotlight__inner comic-card">
                <div className="member-spotlight__photo-wrap">
                  <img
                    src={member.photo}
                    alt={`Foto ${member.name}`}
                    className="member-spotlight__photo"
                  />
                  <div className="member-spotlight__click-hint">🔍 Klik untuk detail</div>
                </div>
                <div className="member-spotlight__info">
                  <span className="comic-badge" style={{ background: '#2ABF5A', color: '#fff', marginBottom: '12px', display: 'inline-flex', fontSize: '14px' }}>
                    ★ {member.role}
                  </span>
                  <h2 className="member-spotlight__name">{member.name}</h2>
                  <div className="member-spotlight__meta">
                    <p><Hash size={14} strokeWidth={3} /> <strong>NIM:</strong> {member.nim}</p>
                    <p><Building2 size={14} strokeWidth={3} /> {member.faculty}</p>
                    <p><GraduationCap size={14} strokeWidth={3} /> {member.major}</p>
                  </div>
                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="member-ig-link"
                      onClick={e => e.stopPropagation()}
                    >
                      <Link2 size={14} strokeWidth={3} />
                      @{member.instagram}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Divider */}
          <div className="member-divider">
            <span className="comic-badge" style={{ background: 'var(--color-panel-2)', fontSize: '14px' }}>
              👇 13 Anggota Lainnya
            </span>
          </div>

          {/* Member grid */}
          <div className="member-grid">
            {members.slice(1).map((member, i) => {
              const roleColor = getRoleColor(member.role);
              return (
                <motion.div
                  key={member.id}
                  className="member-card comic-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: (i % 4) * 0.07, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelected(member)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Photo */}
                  <div className="member-card__photo-wrap">
                    <img
                      src={member.photo}
                      alt={`Foto ${member.name}`}
                      className="member-card__photo"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="member-card__overlay">
                      <span>🔍 Lihat Detail</span>
                    </div>
                    {/* Number badge */}
                    <div className="member-card__number" style={{ background: 'var(--color-primary)' }}>
                      {i + 2}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="member-card__info">
                    <span
                      className="comic-badge member-role-badge"
                      style={{ background: roleColor.bg, color: roleColor.text }}
                    >
                      {member.role}
                    </span>
                    <h3 className="member-card__name">{member.name}</h3>
                    <p className="member-card__major">{member.major}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOTO BERSAMA ── */}
      <section className="section-padding" style={{ background: '#f0fdf4', borderTop: 'var(--border)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="comic-badge" style={{ background: 'var(--color-secondary)', marginBottom: '12px', display: 'inline-flex' }}>
              📸 Foto Bersama
            </span>
            <h2 className="section-title section-title-underline">Kita Semua!</h2>
            <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              KKN 216 — Desa Babakansari, Sukaluyu, Cianjur
            </p>
          </div>

          <motion.div
            className="group-photo-card comic-card"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/members/15.jpg"
              alt="Foto Bersama KKN 216 Babakansari"
              className="group-photo-img"
            />
            <div className="group-photo-caption">
              <span>📸</span>
              <div>
                <strong>Foto Bersama KKN 216</strong>
                <p>Kenangan Indah Bersama di Desa Babakansari</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <MemberModal member={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;
