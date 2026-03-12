import React from 'react';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';

const MainLayout = ({ children, onJoinClick }) => {
  return (
    <div>
      <Header onJoinClick={onJoinClick} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
