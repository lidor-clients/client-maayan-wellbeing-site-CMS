import SectionTitle from './SectionTitle';
import { Brain, Heart, Leaf, Sparkles } from 'lucide-react';
import type { AboutContent } from '../../types/content';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Heart, Leaf, Sparkles
};

interface Props {
  content: AboutContent;
}

export default function About({ content }: Props) {
  return (
    <section id="about" className="py-20 bg-warm-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={content.sectionTitle}
          subtitle={content.sectionSubtitle}
        />

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {content.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {content.highlights.map((item, index) => {
              const Icon = iconMap[item.icon] || Sparkles;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-warm-200"
                >
                  <Icon className="w-10 h-10 text-sage-500 mb-3" />
                  <h3 className="font-semibold text-sage-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-sage-600 to-sage-700 text-white p-8 md:p-12 rounded-3xl text-center">
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            {content.missionStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
