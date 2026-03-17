import React from 'react';
import SectionTitle from '../../../shared/components/atoms/SectionTitle';
import FeatureCard from '../../../shared/components/atoms/FeatureCard';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import './BenefitsSection.css';

const benefits = [
  {
    icon: '🏢',
    title: 'HQ Support',
    description: 'Full support from Nike Headquarters throughout store setup and daily operations.',
  },
  {
    icon: '👟',
    title: 'Product Catalog',
    description: 'Access to the official product catalog featuring the latest collections and exclusive drops.',
  },
  {
    icon: '🎨',
    title: 'Brand Identity',
    description: 'Authentic Nike brand identity guidelines for store design, marketing, and visual merchandising.',
  },
  {
    icon: '🎓',
    title: 'Training Program',
    description: 'Comprehensive training in operations management, sales techniques, and customer experience.',
  },
];

const BenefitsSection = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="benefits" id="benefits">
      <div className="container">
        <SectionTitle
          title="Partner Benefits"
          subtitle="As a franchise partner, you'll receive comprehensive support from Nike to ensure your success."
        />
        <div
          ref={ref}
          className={`benefits__grid stagger-children ${isVisible ? 'reveal--visible' : ''}`}
        >
          {benefits.map((item, index) => (
            <div key={index} className="hover-lift">
              <FeatureCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
