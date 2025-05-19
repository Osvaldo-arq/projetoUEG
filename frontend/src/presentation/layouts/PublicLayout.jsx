import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const PublicLayout = ({ children }) => {
  const [view, setView] = useState('home');

  return (
    <>
      <Navbar onChangeView={setView} />
      {children}
    </>
  );
};

export default PublicLayout;