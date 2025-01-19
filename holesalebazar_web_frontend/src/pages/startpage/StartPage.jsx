import React from 'react';
import Header from '../../components/Header';
import Home from '../../components/Home';
import Services from '../../components/Services';
import About from '../../components/About';

import Footer from '../../components/Footer';
import './StartPage.css';

const StartPage = () => {
  return (
    <div>
      <Header />
      <Home />
      <Services />
      <About />
      <Footer />
    </div>
  );
}

export default StartPage;
