import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import './Navbar.css';

const navLinks: { to: string; label: string; special?: boolean }[] = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/program-kerja', label: 'Program Kerja' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/anggota', label: 'Anggota' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/kontak', label: 'Kontak' },
  { to: '/absensi', label: '✋ Absensi', special: true },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <img src="/734622969_18159090112426253_7593957458933089080_n.jpg" alt="Desa Babakansari Logo" className="navbar__logo-img" />
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">KKN 216</span>
            <span className="navbar__logo-sub">Babakansari</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''} ${link.special ? 'navbar__link--special' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              boxShadow: '2px 2px 0 var(--color-border)',
              transition: 'transform 0.2s',
            }}
          >
            {isDark ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
          </button>

          {/* Mobile toggle */}
          <button
            className="navbar__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''} ${link.special ? 'navbar__mobile-link--special' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
