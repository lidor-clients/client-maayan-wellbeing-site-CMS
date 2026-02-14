import SectionTitle from './SectionTitle';
import Button from './Button';
import { Calendar, Sparkles, MessageCircle } from 'lucide-react';
import type { ServicesContent } from '../../types/content';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, MessageCircle
};

interface Props {
  content: ServicesContent;
}

export default function Services({ content }: Props) {
  return (
    <section id="services" className="py-20 bg-sage-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={content.sectionTitle}
          subtitle={content.sectionSubtitle}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {content.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
                  service.featured ? 'ring-2 ring-sage-400' : ''
                }`}
              >
                {service.featured && service.featuredBadge && (
                  <div className="bg-sage-600 text-white text-center py-2 text-sm font-medium">
                    {service.featuredBadge}
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-sage-800">{service.title}</h3>
                      <p className="text-sage-600">{service.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {service.dates && (
                    <div className="flex items-center gap-2 text-blush-600 mb-4">
                      <Calendar size={18} />
                      <span className="font-medium">{service.dates}</span>
                    </div>
                  )}

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={service.href}
                    variant={service.featured ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {service.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
