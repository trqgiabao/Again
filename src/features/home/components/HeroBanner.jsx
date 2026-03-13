import { useCallback, useEffect, useState } from 'react';
import hero1 from '../../../assets/hero-1.jpg';
import hero2 from '../../../assets/hero-2.jpg';
import hero3 from '../../../assets/hero-3.jpg';
import hero4 from '../../../assets/hero-4.jpg';
import hero5 from '../../../assets/hero-5.jpg';
import Button from '../../../shared/components/atoms/Button';
import useCountUp from '../../../shared/hooks/useCountUp';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import './HeroBanner.css';

const slides = [
  { image: hero1, subtitle: 'Premium Retail Experience' },
  { image: hero2, subtitle: 'Iconic Store Presence' },
  { image: hero3, subtitle: 'Empowering Athletes Everywhere' },
  { image: hero4, subtitle: 'World-Class Product Range' },
  { image: hero5, subtitle: 'Strong Partnership Network' },
];

const HeroBanner = ({ onApplyClick }) => {
  const [ref, isVisible] = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.3 });

  const countryCount = useCountUp(190, 2000, statsVisible);
  const employeeCount = useCountUp(75, 2000, statsVisible);
  const revenueCount = useCountUp(51, 2000, statsVisible);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero__overlay" />

      <div className="hero__content container">
        <div ref={ref} className="">
          <div className="hero__badge">Nike Franchise System</div>
          <h1 className="hero__title">
            Become a Nike<br />
            <span className="hero__title--accent">Franchise Partner</span>
          </h1>
          <p className="hero__subtitle" key={current}>
            {slides[current].subtitle} — Start your journey with the world's most iconic sports brand.
          </p>
          <div ref={ref} className={"hero__action"}>
            <Button variant="accent" size="lg" className={`btn-animate ${isVisible ? 'reveal--visible' : ''}`} onClick={onApplyClick}>Apply for Franchise</Button>
            <Button variant="secondary" size="lg" className="hero__btn-secondary">Learn More</Button>
          </div>
        </div>

        <div ref={statsRef} className="hero__illustration float-animation">
          <div className="hero__stats-card">
            <div className="hero__stat">
              <span className="hero__stat-number">{countryCount}+</span>
              <span className="hero__stat-label">Countries</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">{employeeCount}K+</span>
              <span className="hero__stat-label">Employees</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">${revenueCount}B</span>
              <span className="hero__stat-label">Revenue</span>
            </div>
          </div>
        </div>
      </div>

      <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
};

export default HeroBanner;
