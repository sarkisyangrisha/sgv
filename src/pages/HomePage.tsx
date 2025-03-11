import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowToBuy from '../components/HowToBuy';
import Benefits from '../components/Benefits';
import Cars from '../components/Cars';
import CustomsCalculator from '../components/CustomsCalculator';
import Services from '../components/Services';
import News from '../components/News';
import Reviews from '../components/Reviews';
import Consultation from '../components/Consultation';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <Hero />
      <HowToBuy />
      <Benefits />
      <Cars />
      <div className="container mx-auto px-4 py-8">
        <CustomsCalculator />
      </div>
      <Services />
      <News />
      <Reviews />
      <Consultation />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default HomePage;