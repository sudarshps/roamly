// components/Footer.jsx
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-600 text-white">
      <div className="max-w-7xl mx-auto px-16 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold">Roamly.</h2>
            </div>
            <p className="mb-6 text-gray-100">
              Inspiring travelers to explore the world through authentic experiences, stunning destinations, 
              and practical travel tips. Your journey begins with Roamly.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="hover:text-gray-200 transition-colors">
                <Instagram />
              </Link>
              <Link href="https://twitter.com" className="hover:text-gray-200 transition-colors">
                <Twitter />
              </Link>
              <Link href="https://facebook.com" className="hover:text-gray-200 transition-colors">
                <Facebook />
              </Link>
              <Link href="mailto:hello@roamly.com" className="hover:text-gray-200 transition-colors">
                <Mail />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/destinations" className="hover:underline">Destinations</Link></li>
              <li><Link href="/travel-guides" className="hover:underline">Travel Guides</Link></li>
              <li><Link href="/tips" className="hover:underline">Travel Tips</Link></li>
              <li><Link href="/photography" className="hover:underline">Photography</Link></li>
              <li><Link href="/gear" className="hover:underline">Travel Gear</Link></li>
            </ul>
          </div>

          {/* Company info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/newsletter" className="hover:underline">Newsletter</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-teal-400 mt-12 pt-8">
          <div className="max-w-md mx-auto md:mx-0">
            <h3 className="text-lg font-semibold mb-4">Join Our Adventure</h3>
            <p className="mb-4 text-gray-100">Subscribe to our newsletter for travel inspiration, tips, and exclusive offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded flex-grow text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button className="bg-white text-teal-600 hover:bg-gray-100 px-4 py-2 rounded font-medium transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-left mt-12 text-sm text-gray-100">
          <p>© {currentYear} Roamly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;