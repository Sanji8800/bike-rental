import { Link, useParams } from 'react-router';
import { Star, ArrowLeft } from 'lucide-react';
import bikesData from '../assets/bikes.json';
import { type JSX } from 'react';
import Modal from '../components/rent-modal';

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

export default function BikePage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const bike = (bikesData as Bike[]).find((b) => b.id === id);

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Bike not found</h2>
          <p className="text-gray-400 mb-6">We couldn't find the bike you're looking for.</p>
          <Link to="/bikes" className="inline-block px-4 py-2 rounded-md bg-[#242424] border border-[#333] text-[#4a9d6a]">
            Back to Bikes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#131313] text-white pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
          {/* Back */}
          <div className="mb-6 mt-18">
            <Link to="/bikes" className="inline-flex items-center gap-3 bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#262626] text-[#d6d6d6] hover:bg-[#242424] transition">
              <ArrowLeft className="w-4 h-4 text-[#bdbdbd]" />
              <span>Back to Bikes</span>
            </Link>
          </div>

          {/* Card */}
          <article className="bg-[#222] rounded-2xl overflow-hidden border border-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left: Image */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[640px] rounded-lg overflow-hidden bg-[#111] p-3">
                  <img src={bike.image} alt={bike.name} className="w-full h-[360px] md:h-[420px] object-cover rounded-lg" loading="lazy" />
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex flex-col justify-start">
                <header>
                  <h1 className="text-4xl font-bold text-[#4a9d6a] mb-3">{bike.name}</h1>

                  {/* Category / badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#111] border border-[#2a2a2a] text-[#9fbf99]">{bike.category}</span>
                    {bike.badge && <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#4a9d6a] text-black font-semibold">{bike.badge}</span>}
                  </div>

                  {/* stars */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1">
                      {[...Array(Math.round(bike.rating))].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#ffd700] fill-current" />
                      ))}
                    </div>
                    <div className="text-[#bdbdbd] text-sm">• {bike.rating.toFixed(1)} rating</div>
                  </div>

                  <p className="text-[#bdbdbd] leading-relaxed mb-6">{bike.description}</p>
                </header>

                <div className="mt-4">
                  <div className="text-3xl font-bold text-[#4a9d6a] mb-6">${bike.price_per_day}/day</div>

                  <div className="flex gap-6 flex-wrap">
                    <Modal />
                  </div>

                  {/* small meta */}
                  <div className="mt-6 text-sm text-[#bdbdbd]">
                    <div>
                      Availability: <span className={`ml-2 ${bike.availability ? 'text-[#9ff0a6]' : 'text-[#ff9b9b]'}`}>{bike.availability ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div className="mt-1">
                      Stock: <span className="ml-2 text-[#d1d1d1]">{bike.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#252525]" />

            {/* Key features */}
            <section className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>

              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {bike.features.map((f, idx) => (
                  <div key={idx} className="bg-[#111] rounded-lg p-6 flex flex-col items-center gap-4 shadow-[0_8px_18px_rgba(0,0,0,0.4)]">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#2d5a3d] to-[#4a9d6a] flex items-center justify-center" />
                    <div className="text-sm text-[#d6d6d6] text-center">{f}</div>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>

        {/* Footer spacing */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">{/* optional notes or related bikes could go here */}</div>
      </main>
    </>
  );
}
