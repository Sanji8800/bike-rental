import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What do I need to rent a bike?',
      answer: 'You need a valid ID, credit card for security deposit, and to be at least 18 years old. We also recommend wearing appropriate safety gear.',
    },
    {
      question: 'Can I cancel or modify my reservation?',
      answer: 'Yes, you can cancel or modify your reservation up to 24 hours before your rental time without any charges.',
    },
    {
      question: 'Do you provide helmets and safety equipment?',
      answer: 'Yes, we provide complimentary helmets with every rental. Additional safety equipment like lights and locks are also available.',
    },
    {
      question: 'What happens if the bike gets damaged?',
      answer: 'Minor wear and tear is expected. For significant damage, repair costs will be deducted from your security deposit. We recommend our insurance option for peace of mind.',
    },
  ];

  return (
    <section className="py-20 bg-[#2a2a2a]">
      <div className="px-5">
        <h2 className="text-4xl font-bold text-center text-white mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4 ">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-[10px] border border-[#333] overflow-hidden ">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className=" cursor-pointer w-full px-6 py-6  bg-[#1a1a1a] flex justify-between items-center transition-colors duration-300">
                <h3 className="text-lg font-semibold text-text-light text-left  ">{faq.question}</h3>
                <Plus size={24} className={`text-[#4a9d6a] transition-transform duration-300 ${activeIndex === index ? 'rotate-45' : ''}`} />
              </button>

              {activeIndex === index && <div className="px-6 pb-6 text-text-muted leading-relaxed bg-[#1a1a1a]">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
