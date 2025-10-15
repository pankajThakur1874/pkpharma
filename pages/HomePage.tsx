import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Bot } from 'lucide-react';

const carouselImages = [
  'https://images.unsplash.com/photo-1584308666744-8480404b65ae?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1887&auto=format&fit=crop',
];

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center mb-4 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-subtle">{children}</p>
    </div>
);


const HomePage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 md:space-y-20">
      {/* Hero Section */}
      <section className="relative text-center text-white bg-primary-dark py-20 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1607619056574-7d8d3ee536b2?q=80&w=1910&auto=format&fit=crop')"}}
        ></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Your Health, Our Priority.</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Quality medicines, expert advice, and compassionate care. We are your trusted partner in wellness.
          </p>
          <Link
            to="/medicines"
            className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg"
          >
            Explore Our Medicines
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose People Kind Pharma?</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<ShieldCheck size={48} />} title="Quality Assured">
                We provide only authentic and high-quality medicines sourced directly from reputable manufacturers.
            </FeatureCard>
            <FeatureCard icon={<Package size={48} />} title="Wide Range of Products">
                Find a comprehensive catalog of prescription and over-the-counter medicines to meet all your needs.
            </FeatureCard>
            <FeatureCard icon={<Bot size={48} />} title="Expert Pharmacist Support">
                Our knowledgeable team is here to answer your questions and provide professional guidance.
            </FeatureCard>
        </div>
      </section>
      
      {/* Carousel Section */}
      <section className="container mx-auto px-4">
         <h2 className="text-3xl font-bold text-center mb-10">Dedicated to a Healthier Future</h2>
        <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden rounded-lg shadow-2xl">
          {carouselImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Carousel image ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImage(index)} className={`w-3 h-3 rounded-full ${index === currentImage ? 'bg-white' : 'bg-white/50'}`}></button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
