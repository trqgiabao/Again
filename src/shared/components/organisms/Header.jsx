import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import './Header.css';

const Header = ({ onJoinClick }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        
        <a href="/" className="header__logo">
          <svg className="header__swoosh" viewBox="0 0 69 32" fill="currentColor">
            <path d="M68.56 4.05c-.28-.12-.57-.2-.87-.25-.67-.1-1.35.03-1.95.38L21.6 27.01c-5.49 2.73-10.98 3.26-14.89 1.46C2.78 26.5.75 21.8 1.35 15.73 1.94 9.56 5.13 4.03 9.64 1.28c.6-.37 1.16-.45 1.61-.27.45.18.73.6.73 1.1v.15c-.02.48-.24.94-.62 1.27-3.35 2.85-5.5 6.92-5.98 11.3-.37 3.38.33 6.11 1.93 7.51 1.61 1.41 4.12 1.57 6.87.5L66.44 1.05c.74-.37 1.57-.37 2.12.02z" />
          </svg>

          <div className="header__brand-group">
            <span className="header__brand">Franchise</span>
            <span className="header__brand-sub">Partner Program</span>
          </div>
        </a>

        <button
          className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <a href="#conditions" className="header__link">Requirements</a>
          <a href="#benefits" className="header__link">Benefits</a>
          <a href="#investment" className="header__link">Investment</a>
          <a href="#stories" className="header__link">Stories</a>
        </nav>

        <div className="header__actions">
          <Button
            variant="accent"
            size="sm"
            className="btn-animate"
            onClick={() => navigate('/signin')}
          >
            Sign in
          </Button>

          <Button
            variant="accent"
            size="sm"
            className="btn-animate"
            onClick={onJoinClick}
          >
            Join now
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;