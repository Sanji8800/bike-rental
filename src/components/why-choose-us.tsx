import { Bike, DollarSign, Headset, MousePointer2 } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Bike className="size-10" />,
      title: 'Wide Selection',
      description: 'Choose from our extensive fleet of premium bikes for every terrain and preference.',
    },
    {
      icon: <DollarSign className="size-10" />,
      title: 'Affordable Rates',
      description: 'Competitive pricing with flexible rental options to fit your budget and schedule.',
    },
    {
      icon: <MousePointer2 className="size-10" />,
      title: 'Easy Booking',
      description: 'Simple online booking system with instant confirmation and flexible pickup options.',
    },
    {
      icon: <Headset className="size-10" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you throughout your rental experience.',
    },
  ];

  return (
    <section className="w-full bg-[#2a2a2a] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-4xl font-bold text-center text-white mb-12 relative pb-4 
          after:content-[''] after:absolute after:bottom-0 after:left-1/2 
          after:-translate-x-1/2 after:w-20 after:h-1 
          after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          Why Choose BikeRent?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-8 rounded-[15px] text-center border border-[#333] 
              transition-all duration-300 hover:-translate-y-2.5 
              hover:shadow-[0_15px_30px_rgba(45,90,61,0.2)]">
              <div className="size-20 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-[#4a9d6a] mb-4">{feature.title}</h3>
              <p className="text-[#b0b0b0] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
