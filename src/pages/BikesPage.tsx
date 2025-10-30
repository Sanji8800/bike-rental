import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import bikesData from '../assets/bikes.json';
import { Link } from 'react-router';
import { scrollToSection } from '../utils/scrollToSection';

interface Bike {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  badge: string | null;
  rating: number;
  availability: boolean;
  stock: number;
  image: string;
  description: string;
  features: string[];
}

const BikesPage: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('Name');

  const navbarRef = useRef<HTMLDivElement>(null);
  const [activeSection] = useState('');

  useEffect(() => {
    setBikes(bikesData as Bike[]);
  }, []);

  useEffect(() => {
    let bikesToFilter = [...bikes];
    if (categoryFilter !== 'All Categories') {
      bikesToFilter = bikesToFilter.filter((bike) => bike.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    bikesToFilter = bikesToFilter.filter((bike) => bike.price_per_day >= priceRange[0] && bike.price_per_day <= priceRange[1]);

    const sortedBikes = [...bikesToFilter].sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Price (low to high)':
          return a.price_per_day - b.price_per_day;
        case 'Price (high to low)':
          return b.price_per_day - a.price_per_day;
        case 'Popularity':
          return b.rating - a.rating;
        case 'Newest arrivals':
          return 0;
        default:
          return 0;
      }
    });

    setFilteredBikes(sortedBikes);
  }, [bikes, categoryFilter, priceRange, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
      <Navbar scrollToSection={(ref) => scrollToSection(ref, navbarRef as React.RefObject<HTMLDivElement>)} activeSection={activeSection} navbarRef={navbarRef as React.RefObject<HTMLDivElement>} />
      <main className="grow container mx-auto mt-22 px-4 pt-8">
        <h1 className="text-6xl font-bold text-[#e0e0e0] text-center mb-8 tracking-tight">Our Premium Bicycle Collection</h1>
        <p className="text-center text-lg text-[#a0a0a0] mb-12 mx-[30%]">Discover the perfect bike for your next adventure from our extensive fleet of high-quality bicycles</p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="relative">
            <select
              className="block appearance-none bg-[#242424] border border-[#333] text-[#d1d1d1] py-2 px-4 pr-8 rounded leading-tight
               focus:outline-none focus:bg-[#2a2a2a] focus:border-[#4a9d6a] transition-colors duration-150"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>All Categories</option>
              <option>Road</option>
              <option>Mountain</option>
              <option>Hybrid</option>
              <option>Electric</option>
              <option>City</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="fill-current h-4 w-4 text-[#bdbdbd]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              className="block appearance-none bg-[#242424] border border-[#333] text-[#d1d1d1] py-2 px-4 pr-8 rounded leading-tight
               focus:outline-none focus:bg-[#2a2a2a] focus:border-[#4a9d6a] transition-colors duration-150"
              value={`${priceRange[0]}-${priceRange[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setPriceRange([min, max]);
              }}>
              <option value="0-100">All Prices</option>
              <option value="0-20">$0 - $20</option>
              <option value="21-30">$21 - $30</option>
              <option value="31-50">$31 - $50</option>
              <option value="51-100">$51+</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="fill-current h-4 w-4 text-[#bdbdbd]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              className="block appearance-none bg-[#242424] border border-[#333] text-[#d1d1d1] py-2 px-4 pr-8 rounded leading-tight
               focus:outline-none focus:bg-[#2a2a2a] focus:border-[#4a9d6a] transition-colors duration-150"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option>Sort By</option>
              <option>Price (low to high)</option>
              <option>Price (high to low)</option>
              <option>Popularity</option>
              <option>Newest arrivals</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="fill-current h-4 w-4 text-[#bdbdbd]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-312 mx-auto">
          {filteredBikes.map((bike) => (
            <article key={bike.id} className="relative rounded-2xl overflow-hidden bg-[#2a2a2a] shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
              {bike.badge && <span className="absolute top-4 left-4 z-20 bg-[#4a9d6a] text-black text-xs font-semibold px-3 py-1 rounded-full">{bike.badge}</span>}

              <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                <img src={bike.image} alt={bike.name} className="w-full h-full object-cover block " loading="lazy" />
              </div>

              <div className="p-4 md:p-6 bg-[#2a2a2a]">
                <h3 className="text-xl md:text-2xl font-bold text-[#4a9d6a] mb-3">{bike.name}</h3>

                <p className="text-gray-400 text-md md:text-md mb-4 line-clamp-3">{bike.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {bike.features.map((feature, i) => (
                    <span key={i} className="bg-[#0f0f0f] border border-[#222] text-[#cfcfcf] text-xs px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-2">
                  <div className="text-[#4a9d6a] font-bold text-xl mb-6">${bike.price_per_day}/day</div>

                  <Link
                    to={`/bikes/${bike.id}`}
                    className="w-full inline-block text-white font-semibold py-3 rounded-full
                     bg-linear-to-tr from-[#2d5a3d] to-[#4a9d6a]
                     hover:from-[#3b7a53] hover:to-[#5fbf80]
                     shadow-[inset_0_-6px_18px_rgba(0,0,0,0.25)]
                     transition-transform duration-200 ease-in-out transform hover:-translate-y-0.5 cursor-pointer text-center"
                    aria-label={`View details for ${bike.name}`}>
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="w-full" aria-labelledby="cta-heading" role="region">
          <div className="w-full bg-Linear-to-br from-[#163b2a] via-[#2b6b46] to-[#4a9d6a]">
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-16 text-center">
              <h2 id="cta-heading" className="text-white font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
                Ready to Start Your Adventure?
              </h2>
              <p className="mt-4 max-w-[60ch] mx-auto text-white text-sm md:text-base">Choose your perfect bike and book your rental today!</p>
              <button className="mt-8 inline-block text-white font-semibold py-3 px-8 rounded-full bg-linear-to-tr from-[#2d5a3d] to-[#4a9d6a] hover:from-[#3b7a53] hover:to-[#5fbf80] shadow-[inset_0_-6px_18px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-in-out transform hover:-translate-y-0.5 cursor-pointer">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BikesPage;
