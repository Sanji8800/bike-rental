import Layout from './components/layout';
import Navbar from './components/navbar';
import Hero from './components/hero';
import WhyChooseUs from './components/why-choose-us';
import AboutUs from './components/about-us';
import BikeCategories from './components/bike-categories';
import HowItWorks from './components/how-it-works';
import Testimonials from './components/testimonials';
import Contact from './components/contact';
import Faq from './components/faq';
import Footer from './components/footer';
import { useRef, useEffect, useState } from 'react';
import { scrollToSection } from './utils/scrollToSection';

export default function App() {
  const navbarRef = useRef<HTMLDivElement>(null);

  const aboutRef = useRef<HTMLDivElement>(null);
  const bikesRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    about: aboutRef,
    bikes: bikesRef,
    'how-it-works': howItWorksRef,
    contact: contactRef,
  };

  const [activeSection, setActiveSection] = useState('');

  // Remove the local scrollToSection function

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && sectionRefs[hash as keyof typeof sectionRefs]) {
        scrollToSection(sectionRefs[hash as keyof typeof sectionRefs] as React.RefObject<HTMLDivElement>, navbarRef as React.RefObject<HTMLDivElement>);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Adjust this to change when the section becomes active
        threshold: 0,
      }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  return (
    <div className="no-scrollbar">
      <Layout>
        <Navbar scrollToSection={(ref) => scrollToSection(ref, navbarRef as React.RefObject<HTMLDivElement>)} activeSection={activeSection} navbarRef={navbarRef as React.RefObject<HTMLDivElement>} />
        <Hero />
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <WhyChooseUs />
        </div>
        <AboutUs ref={aboutRef} id="about" />
        <BikeCategories ref={bikesRef} id="bikes" />
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <HowItWorks ref={howItWorksRef} id="how-it-works" />
        </div>
        <Testimonials />
        <Contact ref={contactRef} id="contact" />
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <Faq />
        </div>
        <Footer />
      </Layout>
    </div>
  );
}
