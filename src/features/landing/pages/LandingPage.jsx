import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import TrustSection from '../components/TrustSection';
import InterviewCategories from '../components/InterviewCategories';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';
import Footer from '../../../components/layout/Footer';

/**
 * Landing page — public marketing page assembled from modular sections.
 */
export default function LandingPage() {
  
  // Basic SEO meta tags insertion
  useEffect(() => {
    document.title = "AMIE - AI Mock Interview Ecosystem";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Practice technical and behavioral interviews with advanced AI. Get instant feedback and land your dream job.');
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Practice technical and behavioral interviews with advanced AI. Get instant feedback and land your dream job.";
      document.head.appendChild(meta);
    }
    
    // Cleanup if needed, though usually meta tags persist
    return () => {
      document.title = "AMIE";
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <SearchSection />
        <TrustSection />
        <InterviewCategories />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
