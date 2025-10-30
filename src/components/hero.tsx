import { Link } from 'react-router';

export default function Hero() {
  return (
    <section id="home" className="mt-20 flex items-center bg-transparent h-[calc(100vh-64px)]">
      <div className="  w-full px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-[fadeInLeft_1s_ease-out]">
            <h1 className="text-5xl lg:text-[3.5rem] font-bold mb-6 bg-linear-to-r from-white to-[#4a9d6a] bg-clip-text text-transparent leading-tight">Explore the City on Two Wheels</h1>
            <p className="text-xl text-[#b0b0b0] mb-8 leading-relaxed">Premium bike rentals for every adventure. From city cruising to mountain trails, we've got the perfect ride for you.</p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/bikes"
                className="inline-block px-[30px] py-3 no-underline rounded-[25px] font-semibold text-center transition-all duration-300 ease-in-out border-2 cursor-pointer text-base bg-[linear-gradient(135deg,#2d5a3d,#4a9d6a)] text-white border-[#2d5a3d] hover:bg-[linear-gradient(135deg,#1d3a2d,#2d5a3d)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(45,90,61,0.3)]">
                Rent Now
              </Link>
              <Link
                to="/bikes"
                className="inline-block px-[30px] py-3 no-underline rounded-[25px] font-semibold text-center transition-all duration-300 ease-in-out border-2 cursor-pointer text-base  text-white border-[#2d5a3d] hover:bg-[linear-gradient(135deg,#1d3a2d,#2d5a3d)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(45,90,61,0.3)]">
                Explore Bikes
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="animate-[fadeInRight_1s_ease-out]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Premium Bike"
              className="w-full h-auto rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
