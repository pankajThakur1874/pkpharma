import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Bot, ChevronLeft, ChevronRight, Truck, Clock, CheckCircle } from 'lucide-react';

const carouselImages = [
  {
    src: 'https://images.unsplash.com/photo-1584308666744-8480404b65ae?q=80&w=2070&auto=format&fit=crop',
    alt: 'Close up of medicine bottles on shelf',
  },
  {
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    alt: 'Pharmacist preparing a prescription with care',
  },
  {
    src: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1887&auto=format&fit=crop',
    alt: 'Smiling healthcare team discussing treatment',
  },
];

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children, accent = 'from-teal-400 to-cyan-500' }) => (
  <div className={`p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${accent} text-white`}> 
    <div className="flex justify-center items-center mb-4">
      <div className="p-3 bg-white/20 rounded-full inline-flex">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-2 drop-shadow-md">{title}</h3>
    <p className="text-sm leading-relaxed opacity-90">{children}</p>
  </div>
);

const HomePage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useRef<boolean>(false);
  const autoplayRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq ? mq.matches : false;

    const tick = () => setCurrentImage((prev) => (prev + 1) % carouselImages.length);

    if (!prefersReducedMotion.current) {
      autoplayRef.current = window.setInterval(() => {
        if (!isPaused) tick();
      }, 5000);
    }

    const onKey = (e: KeyboardEvent) => {
      if (!carouselRef.current) return;
      if (!carouselRef.current.contains(document.activeElement)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImage((prev) => (prev + 1) % carouselImages.length);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
      window.removeEventListener('keydown', onKey);
    };
  }, [isPaused]);

  const prev = () => setCurrentImage((p) => (p - 1 + carouselImages.length) % carouselImages.length);
  const next = () => setCurrentImage((p) => (p + 1) % carouselImages.length);

  return (
    <div className="space-y-16 bg-gradient-to-b from-cyan-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        ref={carouselRef}
      >
        <div className="relative w-full h-[65vh] md:h-[75vh]">
          {carouselImages.map((img, index) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/70 via-teal-900/30 to-emerald-900/70" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">
              Your Health, <span className="bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-transparent">Our Priority</span>
            </h1>
            <p className="mt-4 text-white/90 text-lg max-w-2xl">
              Trusted pharmacy for premium medicines and expert healthcare guidance.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/medicines" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-cyan-500 hover:to-emerald-400 text-white rounded-full font-semibold shadow-lg">
                Browse Medicines
              </Link>
              <Link to="/contact" className="px-6 py-3 bg-white/20 text-white hover:bg-white/30 rounded-full font-medium border border-white/30">
                Contact Us
              </Link>
            </div>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-cyan-100 text-cyan-800 p-2 rounded-full shadow-md">
            <ChevronLeft />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-cyan-100 text-cyan-800 p-2 rounded-full shadow-md">
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="container mx-auto px-4" >
        <h2 className="text-3xl font-bold text-center text-cyan-900 mb-4 dark:text-emerald-300">
          Why Choose People Kind Pharma?
        </h2>
        <p className="text-center text-cyan-700 dark:text-cyan-200 max-w-2xl mx-auto mb-8">
          We deliver authentic medicines, expert consultation, and speedy service with compassion and care.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <FeatureCard icon={<ShieldCheck size={28} />} title="Licensed & Certified" accent="from-cyan-500 to-emerald-500">
            All medicines are sourced from verified and certified manufacturers ensuring authenticity.
          </FeatureCard>
          <FeatureCard icon={<Truck size={28} />} title="Fast Delivery" accent="from-emerald-400 to-teal-500">
            Swift and secure delivery with real-time tracking and guaranteed freshness.
          </FeatureCard>
          <FeatureCard icon={<Clock size={28} />} title="Always Available" accent="from-emerald-400 to-teal-500">
            24/7 pharmacy assistance for urgent needs and personalized care.
          </FeatureCard>
          <FeatureCard icon={<CheckCircle size={28} />} title="Quality Assured" accent="from-emerald-400 to-teal-500">
            Rigorous quality control and transparent sourcing for peace of mind.
          </FeatureCard>
          <FeatureCard icon={<Package size={28} />} title="Wide Range" accent="from-emerald-400 to-teal-500">
            From prescription to wellness — find everything in one trusted platform.
          </FeatureCard>
          <FeatureCard icon={<Bot size={28} />} title="Expert Support" accent="from-emerald-400 to-cyan-500">
            Chat with our licensed pharmacists for safe and effective guidance.
          </FeatureCard>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-500 text-white py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold drop-shadow-md">Need help choosing your medicine?</h3>
            <p className="opacity-90">Talk to our pharmacists for expert advice — anytime, anywhere.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="bg-white text-cyan-700 font-semibold px-4 py-2 rounded-md hover:bg-cyan-100">
              Contact Pharmacist
            </Link>
            <Link to="/medicines" className="border border-white text-white px-4 py-2 rounded-md hover:bg-white/20">
              Browse Medicines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;