import React from 'react';
import './SectionDivider.css';

const SectionDivider = ({ variant = 'default' }) => {
  return (
    <div className={`section-divider section-divider--${variant}`}>
      <div className="section-divider__line" />
    </div>
  );
};

export default SectionDivider;
