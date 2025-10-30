import { forwardRef } from 'react';

interface HowItWorksProps {
  id: string;
}

const HowItWorks = forwardRef<HTMLDivElement, HowItWorksProps>(({ id }, ref) => {
  const steps = [
    {
      number: '1',
      title: 'Choose Your Bike',
      description: 'Browse our selection and pick the perfect bike for your adventure.',
    },
    {
      number: '2',
      title: 'Book Online',
      description: 'Complete your reservation with our simple and secure booking system.',
    },
    {
      number: '3',
      title: 'Pick Up & Ride',
      description: 'Collect your bike from our location and start your journey!',
    },
  ];

  return (
    <section id={id} ref={ref} className="py-20 bg-[#2a2a2a]">
      <div className="px-2">
        <h2 className="text-4xl font-bold text-center text-white mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">{step.number}</div>
              <h3 className="text-2xl font-semibold text-[#4a9d6a] mb-4">{step.title}</h3>
              <p className="text-[#b0b0b0] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
