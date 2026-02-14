import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavbarContent } from '../../types/content';

interface Props {
  content: NavbarContent;
}

export default function Navbar({ content }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-warm-50/95 backdrop-blur-sm border-b border-warm-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#home" className="text-xl font-semibold text-sage-700">
            {content.logoText}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {content.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-sage-600 transition-colors duration-200 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-sage-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-warm-50 border-b border-warm-200">
          <div className="px-4 py-4 space-y-3">
            {content.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-600 hover:text-sage-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
