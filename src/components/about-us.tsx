import { Heart, Leaf, Star, Users } from 'lucide-react';
import { forwardRef } from 'react';

interface AboutUsProps {
  id: string;
}

const AboutUs = forwardRef<HTMLDivElement, AboutUsProps>(({ id }, ref) => {
  const stats = [
    { number: '200+', label: 'Premium Bikes' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '8+', label: 'Years Experience' },
    { number: '24/7', label: 'Customer Support' },
  ];

  const values = [
    {
      icon: <Leaf className="size-8 text-white" />,
      title: 'Sustainability',
      description: 'Promoting eco-friendly transportation and reducing carbon footprint through cycling.',
    },
    {
      icon: <Heart className="size-8 text-white" />,
      title: 'Community',
      description: 'Building stronger communities by connecting people through shared cycling experiences.',
    },
    {
      icon: <Star className="size-8 text-white" />,
      title: 'Quality',
      description: 'Maintaining the highest standards in bike quality, safety, and customer service.',
    },
    {
      icon: <Users className="size-8 text-white" />,
      title: 'Accessibility',
      description: 'Making cycling accessible to people of all ages, abilities, and backgrounds.',
    },
  ];

  return (
    <section id={id} ref={ref} className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-center text-white mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          About BikeRent
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-center mb-20 px-2">
          <div>
            <h3 className="text-4xl font-bold text-[#4a9d6a] mb-6 leading-tight">Your Trusted Cycling Partner Since 2015</h3>
            <p className="text-[#b0b0b0] leading-relaxed mb-6 text-lg">
              At BikeRent, we're passionate about making cycling accessible to everyone. Founded with a vision to promote sustainable transportation and outdoor adventure, we've been serving our
              community for over 8 years with premium bike rental services.
            </p>
            <p className="text-[#b0b0b0] leading-relaxed mb-8 text-lg">
              Our journey began when our founders, avid cyclists themselves, noticed the need for high-quality, well-maintained rental bikes in the city. What started as a small operation with just 10
              bikes has grown into a comprehensive fleet of over 200 premium bicycles, serving thousands of satisfied customers annually.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 ">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#2a2a2a] py-8 rounded-[10px] border border-[#333] text-center hover:-translate-y-1.5 transition-all duration-300">
                  <div className="text-[38px] font-bold text-[#4a9d6a] mb-5">{stat.number}</div>
                  <div className="text-[#b0b0b0] text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[15px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] group">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Our bike shop and team"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-[#4a9d6a] mb-2 text-xl font-semibold">Our Mission</h4>
              <p className="text-white text-sm leading-relaxed">To make cycling accessible, enjoyable, and sustainable for everyone while promoting eco-friendly transportation solutions.</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mt-25">
          <h3 className="text-4xl font-bold text-[#4a9d6a] mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] px-4 py-16 rounded-[15px] text-center border border-[#333] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(45,90,61,0.2)]">
                <div className="w-16 h-16 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white">{value.icon}</div>
                <h4 className="text-2xl font-semibold text-[#4a9d6a] mb-4">{value.title}</h4>
                <p className="text-[#b0b0b0] leading-relaxed text-md">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutUs;
