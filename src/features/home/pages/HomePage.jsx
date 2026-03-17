import React from 'react';
import MainLayout from '../../../shared/layouts/MainLayout';
import HeroBanner from '../components/HeroBanner';
import BrandStory from '../components/BrandStory';
import ConditionsSection from '../components/ConditionsSection';
import BenefitsSection from '../components/BenefitsSection';
import CostSection from '../components/CostSection';
import SuccessStories from '../components/SuccessStories';
import CTASection from '../components/CTASection';
import SectionDivider from '../components/SectionDivider';
import FallingShoes from '../components/FallingShoes';
import { useState } from 'react';
import FranchiseModal from '../components/FranchiseModal.jsx';
import FranchiseSuccess from '../components/FranchiseSuccess.jsx';

const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');

  const handleSubmitSuccess = (applicationData) => {
    setApplicationCode(applicationData?.code || '');
    setApplicationStatus(applicationData?.status || '');
    setSuccessOpen(true);
  };
  return (
    <MainLayout onJoinClick={() => setModalOpen(true)}>
      <FallingShoes />
      <HeroBanner onApplyClick={() => setModalOpen(true)} />
      <SectionDivider />
      <BrandStory />
      <SectionDivider variant="accent" />
      <ConditionsSection />
      <SectionDivider />
      <BenefitsSection />
      <SectionDivider variant="accent" />
      <CostSection />
      <SectionDivider />
      <SuccessStories />
      <CTASection onApplyClick={() => setModalOpen(true)} />
      <FranchiseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleSubmitSuccess} />
      <FranchiseSuccess
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        applicationCode={applicationCode}
        applicationStatus={applicationStatus}
      />
    </MainLayout>
  );
};

export default HomePage;
