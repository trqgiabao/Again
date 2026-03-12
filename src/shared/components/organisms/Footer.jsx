import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand-col">
            <div className="footer__logo">
              <svg className="footer__swoosh" viewBox="0 0 69 32" fill="currentColor">
                <path d="M68.56 4.05c-.28-.12-.57-.2-.87-.25-.67-.1-1.35.03-1.95.38L21.6 27.01c-5.49 2.73-10.98 3.26-14.89 1.46C2.78 26.5.75 21.8 1.35 15.73 1.94 9.56 5.13 4.03 9.64 1.28c.6-.37 1.16-.45 1.61-.27.45.18.73.6.73 1.1v.15c-.02.48-.24.94-.62 1.27-3.35 2.85-5.5 6.92-5.98 11.3-.37 3.38.33 6.11 1.93 7.51 1.61 1.41 4.12 1.57 6.87.5L66.44 1.05c.74-.37 1.57-.37 2.12.02z"/>
              </svg>
            </div>
            <p className="footer__tagline">Just Do It.™</p>
            <p className="footer__desc">
              Join the world's most iconic sports brand as a franchise partner and build your future with Nike.
            </p>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Program</h4>
            <a href="#conditions" className="footer__link">Requirements</a>
            <a href="#benefits" className="footer__link">Benefits</a>
            <a href="#investment" className="footer__link">Investment</a>
            <a href="#stories" className="footer__link">Success Stories</a>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Company</h4>
            <a href="#" className="footer__link">About Nike</a>
            <a href="#" className="footer__link">Careers</a>
            <a href="#" className="footer__link">News</a>
            <a href="#" className="footer__link">Sustainability</a>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Support</h4>
            <a href="#" className="footer__link">Contact Us</a>
            <a href="#" className="footer__link">FAQ</a>
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Use</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Nike, Inc. All Rights Reserved.</p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.7 16h4.3L8.3 4H4zm3.3 0L20 20M20 4L4 20"/></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
