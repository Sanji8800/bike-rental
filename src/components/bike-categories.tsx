import { Link } from 'react-router';
import bikesData from '../assets/bikes.json';
import { forwardRef } from 'react';

interface BikeCategoriesProps {
  id: string;
}

const BikeCategories = forwardRef<HTMLDivElement, BikeCategoriesProps>(({ id }, ref) => {
  type Bike = {
    id: string;
    name: string;
    category: string;
    price_per_day: number;
    badge?: string | null;
    rating?: number;
    availability?: boolean;
    stock?: number;
    image: string;
    description?: string;
    features?: string[];
  };

  const bikes = bikesData as Bike[];

  // 🔹 Pick 3 random bikes directly from the data
  const randomBikes = [...bikes].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <section id={id} ref={ref} className="py-20 bg-transparent">
      <div className="px-4">
        <h2
          className="text-4xl font-bold text-center text-white mb-12 relative pb-4
            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
            after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          Our Bike Fleet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {randomBikes.map((bike) => (
            <div key={bike.id} className="bg-[#2a2a2a] rounded-xl overflow-hidden border border-[#333] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
              <div className="h-64 overflow-hidden">
                <img src={bike.image} alt={bike.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
              </div>

              <div className="py-8 px-8">
                <h3 className="text-2xl font-bold text-[#4a9d6a] mb-4">{bike.name}</h3>
                <p className="text-[#b0b0b0] mb-6 leading-relaxed">{bike.description ?? 'A high-quality, reliable bike for your next adventure.'}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-bold text-[#4a9d6a]">${bike.price_per_day}/day</div>
                  <div className="text-sm text-[#bdbdbd] capitalize">{bike.category}</div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/bikes/${encodeURIComponent(bike.id)}`} // 🔸 Directly links to this bike’s page
                    className="inline-flex items-center gap-3 px-6 py-2 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] text-white rounded-full font-semibold text-sm hover:shadow-[0_10px_30px_rgba(74,222,128,0.18)] transition-all duration-300">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/bikes"
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] text-white rounded-full font-semibold text-lg hover:shadow-[0_10px_30px_rgba(74,222,128,0.4)] hover:-translate-y-0.5 transition-all duration-300">
            <i className="fas fa-bicycle" />
            Explore More Bikes
            <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
});

export default BikeCategories;
