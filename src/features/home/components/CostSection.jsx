import React from 'react';
import SectionTitle from '../../../shared/components/atoms/SectionTitle';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import useCountUp from '../../../shared/hooks/useCountUp';
import './CostSection.css';

const CostSection = () => {
  const [ref, isVisible] = useScrollReveal();
  const storeCount = useCountUp(1200, 2000, isVisible);
  const partnerCount = useCountUp(85, 2000, isVisible);
  const countryCount = useCountUp(42, 2000, isVisible);

  return (
    <section className="cost" id="investment">
      <div className="container">
        <SectionTitle
          title="Investment Overview"
        />

        {/* Number counters */}
        <div ref={ref} className={`cost__counters reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <div className="cost__counter">
            <span className="cost__counter-number">{storeCount.toLocaleString()}+</span>
            <span className="cost__counter-label">Franchise Stores</span>
          </div>
          <div className="cost__counter">
            <span className="cost__counter-number">{partnerCount}%</span>
            <span className="cost__counter-label">Partner Satisfaction</span>
          </div>
          <div className="cost__counter">
            <span className="cost__counter-number">{countryCount}+</span>
            <span className="cost__counter-label">Countries Active</span>
          </div>
        </div>

        <div className="cost__grid">
          <div className="cost__card hover-lift">
            <div className="cost__card-icon icon-bounce">💎</div>
            <h3 className="cost__card-title">Franchise Fee</h3>
            <p className="cost__card-desc">
              One-time franchise fee to join the Nike Franchise System and gain access to the brand.
            </p>
            <div className="cost__card-price">Contact Us</div>
          </div>
          <div className="cost__card hover-lift">
            <div className="cost__card-icon icon-bounce">📈</div>
            <h3 className="cost__card-title">Royalty Fee</h3>
            <p className="cost__card-desc">
              Monthly revenue percentage dedicated to brand development and ongoing support.
            </p>
            <div className="cost__card-price">% of Revenue</div>
          </div>
        </div>
        <p className="cost__note">
          * Detailed costs will be provided after registration and application review.
        </p>
      </div>
    </section>
  );
};

export default CostSection;
