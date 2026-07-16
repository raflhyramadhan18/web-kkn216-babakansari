import React from 'react';
import { NavLink } from 'react-router-dom';
import { ExternalLink, Music2, Mail, MapPin, Heart } from 'lucide-react';
import './Footer.css';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/program-kerja', label: 'Program Kerja' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/anggota', label: 'Anggota' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/kontak', label: 'Kontak' },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__top halftone-bg">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo-wrap">
              <img
                src="/734622969_18159090112426253_7593957458933089080_n.jpg"
                alt="Logo Desa Babakansari"
                className="footer__logo"
              />
              <div>
                <h3 className="footer__title">KKN 216</h3>
                <p className="footer__subtitle">BABAKANSARI</p>
              </div>
            </div>
            <p className="footer__desc">
              Kuliah Kerja Nyata Kelompok 216 UIN Sunan Gunung Djati Bandung di Desa Babakansari. Mengabdi, Belajar, Berkembang Bersama! 💚
            </p>
            <div className="footer__socials">
              <a
                href="https://instagram.com/kkn.216.babakansari"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <ExternalLink size={20} strokeWidth={2.5} />
              </a>
              <a
                href="https://tiktok.com/@kkn.216.babakansari"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="TikTok"
              >
                <Music2 size={20} strokeWidth={2.5} />
              </a>
              <a
                href="mailto:kkn216babakansari@gmail.com"
                className="footer__social-link"
                aria-label="Email"
              >
                <Mail size={20} strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__section">
            <h4 className="footer__heading">Navigasi</h4>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="footer__link">
                    → {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="footer__section">
            <h4 className="footer__heading">Informasi</h4>
            <ul className="footer__info-list">
              <li>
                <MapPin size={16} strokeWidth={2.5} />
                <span>Desa Babakansari, Kec. Sukaluyu, Kab. Cianjur</span>
              </li>
              <li>
                <span>🎓</span>
                <span>UIN Sunan Gunung Djati Bandung</span>
              </li>
              <li>
                <span>📅</span>
                <span>1 Juli – 8 Agustus 2026</span>
              </li>
              <li>
                <span>👥</span>
                <span>14 Anggota Kelompok</span>
              </li>
              <li>
                <span>📋</span>
                <span>16 Program Kerja</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p>
          © 2026 KKN 216 Babakansari — UIN Sunan Gunung Djati Bandung
        </p>
        <p className="footer__made-with">
          Dibuat dengan <Heart size={14} fill="currentColor" /> oleh Tim KKN 216
        </p>
      </div>
    </footer>
  );
};

export default Footer;
