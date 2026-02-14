import { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { MessageCircle, Mail, Send, Check } from 'lucide-react';
import type { NewsletterContent } from '../../types/content';

interface Props {
  content: NewsletterContent;
}

export default function Newsletter({ content }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 bg-sage-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={content.sectionTitle}
          subtitle={content.sectionSubtitle}
          light
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp Group */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold mb-3">{content.whatsapp.title}</h3>
            <p className="text-warm-200 mb-6 leading-relaxed">
              {content.whatsapp.description}
            </p>

            <ul className="space-y-2 mb-6 text-warm-200">
              {content.whatsapp.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check size={16} className="text-sage-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              href={content.whatsapp.href}
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-sage-700"
            >
              <MessageCircle size={18} className="ml-2" />
              {content.whatsapp.buttonText}
            </Button>
          </div>

          {/* Email Newsletter */}
          <div className="bg-white rounded-3xl p-8">
            <div className="w-14 h-14 bg-blush-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-blush-600" />
            </div>

            <h3 className="text-2xl font-bold text-sage-800 mb-3">{content.email.title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {content.email.description}
            </p>

            {submitted ? (
              <div className="bg-sage-100 text-sage-700 p-4 rounded-xl text-center">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">תודה שהצטרפת! נתראה בתיבת המייל</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="כתובת המייל שלך"
                    required
                    className="w-full pr-12 pl-4 py-3 border border-warm-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  <Send size={18} className="ml-2" />
                  {content.email.buttonText}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
