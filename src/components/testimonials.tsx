import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      text: 'Amazing service! The bike was in perfect condition and the staff was incredibly helpful. Will definitely rent again!',
      author: 'John Smith',
      role: 'Adventure Enthusiast',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
    {
      text: 'Great selection of bikes and very reasonable prices. The booking process was smooth and hassle-free.',
      author: 'Sarah Johnson',
      role: 'City Explorer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
    {
      text: 'Excellent customer service and top-quality bikes. The electric bike made my city tour absolutely perfect!',
      author: 'Mike Davis',
      role: 'Tourist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20">
      <div className="px-4">
        <h2
          className="text-4xl font-bold text-center text-white mb-12 relative pb-4
          after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
          after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          What Our Customers Say
        </h2>

        <div className="max-w-200 mx-auto relative">
          <div className="bg-[#2a2a2a] p-12 rounded-2xl border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.6)] min-h-[260px]">
            <button
              aria-label="Previous testimonial"
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#2d5a3d] hover:bg-[#4a9d6a] text-white rounded-full flex items-center justify-center shadow-md z-10 transition-transform duration-200">
              <ChevronLeft className="cursor-pointer" />
            </button>

            <button
              aria-label="Next testimonial"
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#2d5a3d] hover:bg-[#4a9d6a] text-white rounded-full flex items-center justify-center shadow-md z-10 transition-transform duration-200 cursor-pointer">
              <ChevronRight className="cursor-pointer" />
            </button>

            <div className="flex flex-col items-center justify-between h-full">
              <div className="flex justify-center items-center gap-4 mb-8">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#ffd700] fill-current" />
                ))}
              </div>

              <p className="text-center text-lg text-[#e0e0e0] italic mb-8 leading-relaxed max-w-[85%] mx-auto">&quot;{testimonials[currentSlide].text}&quot;</p>

              <div className="text-center mt-4">
                <div className="text-lg text-[#b0b0b0]">
                  <span className="text-[#4a9d6a] font-bold ml-2">{testimonials[currentSlide].author}</span>
                </div>
                <div className="text-[#b0b0b0] text-sm mt-2">{testimonials[currentSlide].role}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#4a9d6a] scale-110' : 'bg-[#333]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
