import { Motorbike } from 'lucide-react';
import { BrandInstagram, BrandTwitter, BrandYoutube, BrandFacebook } from 'tabler-icons-react';

export default function Footer() {
  const quickLinks = ['Home', 'Our Bikes', 'Services', 'About Us', 'Contact'];
  const services = ['Bike Rental', 'Guided Tours', 'Bike Maintenance', 'Group Bookings', 'Corporate Events'];
  const support = ['FAQ', 'Terms of Service', 'Privacy Policy', 'Rental Agreement', 'Insurance'];

  return (
    <footer className="bg-[#0e0e0e] border-t border-[#262626] pt-12 pb-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4 ">
              <div className="w-10 h-10 rounded-md bg-[#071007] flex items-center justify-center">
                <Motorbike className="size-10 text-[#4a9d6a]" />
              </div>
              <span className="text-2xl font-bold text-[#4a9d6a]">BikeRent</span>
            </div>

            <p className="text-[#b9b9b9] leading-relaxed mb-6 max-w-[20rem]">
              Your trusted partner for premium bike rentals. Explore the world on two wheels with our top-quality bikes and exceptional service.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-[#171717] rounded-full flex items-center justify-center text-[#bfbfbf] hover:bg-[#4a9d6a] hover:text-white transition-all duration-200">
                <BrandFacebook className="size-6" />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-[#171717] rounded-full flex items-center justify-center text-[#bfbfbf] hover:bg-[#4a9d6a] hover:text-white transition-all duration-200">
                <BrandTwitter className="size-6" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-[#171717] rounded-full flex items-center justify-center text-[#bfbfbf] hover:bg-[#4a9d6a] hover:text-white transition-all duration-200">
                <BrandInstagram className="size-6" />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 bg-[#171717] rounded-full flex items-center justify-center text-[#bfbfbf] hover:bg-[#4a9d6a] hover:text-white transition-all duration-200">
                <BrandYoutube className="size-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="ml-20">
            <h4 className="text-xl font-semibold text-[#4a9d6a] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#bdbdbd] hover:text-[#4a9d6a] transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="ml-4">
            <h4 className="text-xl font-semibold text-[#4a9d6a] mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a href="#" className="text-[#bdbdbd] hover:text-[#4a9d6a] transition-colors duration-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-semibold text-[#4a9d6a] mb-4">Support</h4>
            <ul className="space-y-3">
              {support.map((s) => (
                <li key={s}>
                  <a href="#" className="text-[#bdbdbd] hover:text-[#4a9d6a] transition-colors duration-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#262626] pt-6">
          <p className="text-center text-[#9f9f9f] text-sm">
            © 2025 BikeRent. All rights reserved. &nbsp;|&nbsp; Designed with <span className="text-red-400">❤️</span> for cycling enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
