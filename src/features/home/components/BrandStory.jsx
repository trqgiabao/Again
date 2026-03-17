import React from 'react';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import './BrandStory.css';

const BrandStory = () => {
  const [refLeft, isLeftVisible] = useScrollReveal();
  const [refRight, isRightVisible] = useScrollReveal();

  return (
    <section className="brand-story">
      <div className="container">
        <div className="brand-story__grid">
          <div
            ref={refLeft}
            className={`brand-story__text reveal--left ${isLeftVisible ? 'reveal--visible' : ''}`}
          >
            <span className="brand-story__label">Our Story</span>
            <h2 className="brand-story__title">
              Built on Innovation.<br />
              Driven by <span className="brand-story__accent">Athletes.</span>
            </h2>
            <p className="brand-story__desc">
              Since 1964, Nike has been at the forefront of sports innovation. Our franchise program
              extends this legacy by empowering entrepreneurs worldwide to bring the Nike experience
              to every community.
            </p>
            <p className="brand-story__desc">
              We don't just sell products — we inspire a movement. As a franchise partner,
              you become part of a global network dedicated to pushing boundaries.
            </p>
          </div>
          <div
            ref={refRight}
            className={`brand-story__visual reveal--right ${isRightVisible ? 'reveal--visible' : ''}`}
          >
            <div className="brand-story__cards-container">
              <div className="brand-story__card brand-story__card--1 hover-lift">
                <div className="brand-story__card-icon">🏛️</div>
                <span className="brand-story__card-number">1964</span>
                <span className="brand-story__card-label">Founded</span>
              </div>
              <div className="brand-story__card brand-story__card--2 hover-lift">
                <div className="brand-story__card-swoosh">
                  <svg viewBox="0 0 69 32" fill="currentColor" width="32" height="16">
                    <path d="M68.56 4.05c-.28-.12-.57-.2-.87-.25-.67-.1-1.35.03-1.95.38L21.6 27.01c-5.49 2.73-10.98 3.26-14.89 1.46C2.78 26.5.75 21.8 1.35 15.73 1.94 9.56 5.13 4.03 9.64 1.28c.6-.37 1.16-.45 1.61-.27.45.18.73.6.73 1.1v.15c-.02.48-.24.94-.62 1.27-3.35 2.85-5.5 6.92-5.98 11.3-.37 3.38.33 6.11 1.93 7.51 1.61 1.41 4.12 1.57 6.87.5L66.44 1.05c.74-.37 1.57-.37 2.12.02z"/>
                  </svg>
                </div>
                <span className="brand-story__card-number">Just Do It.</span>
                <span className="brand-story__card-label">Since 1988</span>
              </div>
              <div className="brand-story__card brand-story__card--3 hover-lift">
                <div className="brand-story__card-icon">🏆</div>
                <span className="brand-story__card-number">#1</span>
                <span className="brand-story__card-label">Sports Brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
