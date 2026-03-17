import React, { useState, useEffect, useCallback } from 'react';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import SectionTitle from '../../../shared/components/atoms/SectionTitle';
import './SuccessStories.css';

const stories = [
  {
    name: 'James Chen',
    location: 'Shanghai, China',
    quote: 'Partnering with Nike transformed my retail business. The brand recognition alone drives incredible foot traffic.',
    metric: '3x Revenue Growth',
    years: '4 Years Partner',
    image: null,
  },
  {
    name: 'Maria Santos',
    location: 'São Paulo, Brazil',
    quote: 'The support from Nike HQ was exceptional. From store design to inventory management, they guided us every step.',
    metric: '200+ Customers Daily',
    years: '3 Years Partner',
    image: null,
  },
  {
    name: 'Ahmed Hassan',
    location: 'Dubai, UAE',
    quote: 'Nike\'s franchise model gave us the perfect blueprint. We opened our second store within 18 months.',
    metric: '2 Stores in 18 Months',
    years: '2 Years Partner',
    image: null,
  },
];

const highlights = [
  { number: '95%', label: 'Partner Retention Rate' },
  { number: '2.5x', label: 'Avg. ROI in Year 2' },
  { number: '30+', label: 'Countries with Partners' },
];

const SuccessStories = () => {
  const [current, setCurrent] = useState(0);
  const [ref, isVisible] = useScrollReveal();
  const [refHighlights, highlightsVisible] = useScrollReveal();

  const next = useCallback(() => setCurrent((c) => (c + 1) % stories.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + stories.length) % stories.length), []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isVisible, next]);

  return (
    <section className="stories" id="stories">
      <div className="container">
        <SectionTitle
          title="Success Stories"
          subtitle="Hear from our franchise partners around the world."
        />

        {/* Highlights bar */}
        <div ref={refHighlights} className={`stories__highlights reveal ${highlightsVisible ? 'reveal--visible' : ''}`}>
          {highlights.map((h, i) => (
            <div key={i} className="stories__highlight">
              <span className="stories__highlight-number">{h.number}</span>
              <span className="stories__highlight-label">{h.label}</span>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div ref={ref} className={`stories__carousel reveal ${isVisible ? 'reveal--visible' : ''}`}>
          {stories.map((story, i) => (
            <div
              key={i}
              className={`stories__card ${i === current ? 'stories__card--active' : ''}`}
            >
              <div className="stories__card-inner">
                <div className="stories__quote-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>
                <div className="stories__quote">{story.quote}</div>
                <div className="stories__meta">
                  <div className="stories__avatar">{story.name[0]}</div>
                  <div>
                    <div className="stories__name">{story.name}</div>
                    <div className="stories__location">{story.location}</div>
                  </div>
                  <span className="stories__years">{story.years}</span>
                </div>
                <div className="stories__metric">{story.metric}</div>
              </div>
            </div>
          ))}

          <div className="stories__controls">
            <button className="stories__arrow" onClick={prev} aria-label="Previous story">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className="stories__nav">
              {stories.map((_, i) => (
                <button
                  key={i}
                  className={`stories__nav-dot ${i === current ? 'stories__nav-dot--active' : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <button className="stories__arrow" onClick={next} aria-label="Next story">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
