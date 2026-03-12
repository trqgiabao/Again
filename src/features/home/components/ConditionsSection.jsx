import React from 'react';
import SectionTitle from '../../../shared/components/atoms/SectionTitle';
import FeatureCard from '../../../shared/components/atoms/FeatureCard';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import './ConditionsSection.css';

const conditions = [
  {
    icon: '💰',
    title: 'Capital Investment',
    description: 'Ensure financial capability to operate a store that meets Nike\'s premium standards.',
  },
  {
    icon: '📊',
    title: 'Business Experience',
    description: 'Priority given to partners with experience in retail, fashion, or sportswear industry.',
  },
  {
    icon: '📍',
    title: 'Store Location',
    description: 'Strategic business location that aligns with Nike\'s market development strategy.',
  },
];

const ConditionsSection = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="conditions" id="conditions">
      <div className="container">
        <SectionTitle
          title="Franchise Requirements"
          subtitle="To maintain system quality and the Nike brand experience, franchise partners must meet these fundamental criteria:"
        />
        <div
          ref={ref}
          className={`conditions__grid stagger-children ${isVisible ? 'reveal--visible' : ''}`}
        >
          {conditions.map((item, index) => (
            <div key={index} className="hover-lift">
              <FeatureCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConditionsSection;
