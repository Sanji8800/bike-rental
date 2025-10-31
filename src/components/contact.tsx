import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

interface ContactProps {
  id: string;
}

const Contact = forwardRef<HTMLDivElement, ContactProps>(({ id }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      alert(`Thank you for your message! We'll get back to you soon.`);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  return (
    <section id={id} ref={ref} className="py-16">
      <div className="px-12">
        <h2 className="text-4xl font-bold text-center text-white mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#2d5a3d] after:to-[#4a9d6a] after:rounded">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-semibold text-[#4a9d6a] mb-8">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <PhoneIcon className="text-[#4a9d6a] text-xl mt-1 min-w-fit" />
                <div>
                  <h4 className="text-text-light font-semibold mb-1">Phone</h4>
                  <p className="text-text-light">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MailIcon className="text-[#4a9d6a] text-xl mt-1 min-w-fit" />
                <div>
                  <h4 className="text-text-light font-semibold mb-1">Email</h4>
                  <p className="text-text-light">info@bikerent.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPinIcon className="text-[#4a9d6a] text-xl mt-1 min-w-fit" />
                <div>
                  <h4 className="text-text-light font-semibold mb-1">Address</h4>
                  <p className="text-text-light">
                    123 Bike Street, City Center
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ClockIcon className="text-[#4a9d6a]  text-xl mt-1 min-w-fit" />
                <div>
                  <h4 className="text-text-light font-semibold mb-1">Hours</h4>
                  <p className="text-text-light">Mon-Sun: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-dark p-4 rounded-[15px] border border-[#333]">
            <h3 className="text-2xl font-semibold text-[#4a9d6a] mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-[#4a9d6a] transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-[#4a9d6a] transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-[#4a9d6a] transition-colors duration-300"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-[#4a9d6a] transition-colors duration-300 resize-none"
                  required></textarea>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer px-6 py-3 bg-linear-to-r from-[#2d5a3d] to-[#4a9d6a] text-white rounded-full font-semibold hover:shadow-[0_8px_25px_rgba(45,90,61,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
