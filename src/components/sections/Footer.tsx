import { Heart, Instagram, Mail, Phone } from 'lucide-react';
import type { FooterContent } from '../../types/content';

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

interface Props {
  content: FooterContent;
}

export default function Footer({ content }: Props) {
  return (
    <footer className="bg-sage-800 text-warm-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{content.brandName}</h3>
            <p className="text-warm-200 leading-relaxed">
              {content.brandDescription}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{content.quickLinksTitle}</h4>
            <ul className="space-y-2 text-warm-200">
              {content.quickLinks.map((link, idx) => (
                <li key={idx}><a href={link.href} className="hover:text-white transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{content.contactTitle}</h4>
            <div className="space-y-3 text-warm-200">
              <a href={`mailto:${content.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={18} />
                <span>{content.email}</span>
              </a>
              <a href={`https://wa.me/${content.whatsappNumber}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={18} />
                <span>וואטסאפ</span>
              </a>
              <a href={content.instagramUrl} className="flex items-center gap-2 hover:text-white transition-colors">
                <Instagram size={18} />
                <span>אינסטגרם</span>
              </a>
              <a href={content.facebookUrl} className="flex items-center gap-2 hover:text-white transition-colors">
                <FacebookIcon size={18} />
                <span>פייסבוק</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-700 mt-8 pt-8 text-center text-warm-300">
          <p className="flex items-center justify-center gap-1">
            נבנה באהבה <Heart size={16} className="text-blush-400" /> כל הזכויות שמורות © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
