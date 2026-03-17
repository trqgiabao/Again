import React from 'react';
import Button from '../../../shared/components/atoms/Button';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import './CTASection.css';

const CTASection = ({ onApplyClick }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="cta" id="apply">
      <div className="container">
        <div ref={ref} className={`cta__inner reveal--scale ${isVisible ? 'reveal--visible' : ''}`}>
          <div className="cta__badge">👟 Start Your Journey</div>
          <h2 className="cta__title">Ready to Partner<br />with Nike?</h2>
          <p className="cta__subtitle">
            Apply today to start your journey building a business with the world's most iconic sports brand.
          </p>
          <div className="cta__trust">
            <div className="cta__trust-item">
              <span className="cta__trust-icon">✓</span>
              <span>No hidden fees</span>
            </div>
            <div className="cta__trust-item">
              <span className="cta__trust-icon">✓</span>
              <span>Full brand support</span>
            </div>
            <div className="cta__trust-item">
              <span className="cta__trust-icon">✓</span>
              <span>Proven business model</span>
            </div>
          </div>
          <Button variant="accent" size="lg" className="btn-animate" onClick={onApplyClick}>Apply for Franchise</Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
