import { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Gift, Droplets, ChefHat, Mail, Check } from 'lucide-react';
import type { LeadMagnetsContent } from '../../types/content';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets, ChefHat
};

interface Props {
  content: LeadMagnetsContent;
}

export default function LeadMagnets({ content }: Props) {
  const [activeGift, setActiveGift] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    console.log('Submitted email:', email, 'for gift:', index);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveGift(null);
      setEmail('');
    }, 3000);
  };

  return (
    <section id="gifts" className="py-20 bg-warm-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={content.sectionTitle}
          subtitle={content.sectionSubtitle}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {content.gifts.map((gift, index) => {
            const Icon = iconMap[gift.icon] || Droplets;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                  activeGift === index ? 'ring-2 ring-sage-400' : ''
                }`}
              >
                <div className={`h-2 ${gift.color === 'sage' ? 'bg-sage-500' : 'bg-blush-500'}`} />

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      gift.color === 'sage' ? 'bg-sage-100' : 'bg-blush-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        gift.color === 'sage' ? 'text-sage-600' : 'text-blush-600'
                      }`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-warm-500" />
                      <span className="text-warm-600 font-medium">מתנה חינמית</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-sage-800 mb-3">{gift.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{gift.description}</p>

                  <ul className="space-y-2 mb-6">
                    {gift.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <Check size={16} className={gift.color === 'sage' ? 'text-sage-500' : 'text-blush-500'} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {activeGift === index ? (
                    <form onSubmit={(e) => handleSubmit(e, index)} className="space-y-4">
                      {submitted ? (
                        <div className="bg-sage-100 text-sage-700 p-4 rounded-xl text-center">
                          <Check className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">תודה! המתנה בדרך אלייך</p>
                        </div>
                      ) : (
                        <>
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
                          <Button
                            type="submit"
                            variant={gift.color === 'sage' ? 'primary' : 'secondary'}
                            className="w-full"
                          >
                            שלחי לי את המתנה
                          </Button>
                          <button
                            type="button"
                            onClick={() => setActiveGift(null)}
                            className="w-full text-gray-500 text-sm hover:text-gray-700"
                          >
                            ביטול
                          </button>
                        </>
                      )}
                    </form>
                  ) : (
                    <Button
                      onClick={() => setActiveGift(index)}
                      variant={gift.color === 'sage' ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {gift.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
