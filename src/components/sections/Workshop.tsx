import type { ComponentType, ReactNode } from "react";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { Calendar, Clock, Video, Users, Sparkles, Check, Heart } from "lucide-react";
import type { WorkshopContent } from "../../types/content";

type IconComp = ComponentType<{ className?: string; size?: number | string }>;

const iconMap: Record<string, IconComp> = {
  Calendar,
  Clock,
  Video,
  Users,
};

interface Props {
  content: WorkshopContent;
  syllabusEditSlot?: ReactNode;
}

export default function Workshop({ content, syllabusEditSlot }: Props) {
  return (
    <section id="workshop" className="py-20 bg-warm-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={content.sectionTitle} subtitle={content.sectionSubtitle} />

        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            {content.introParagraphs.map((p, idx) => (
              <p
                key={idx}
                className={`${idx === 0 ? "text-xl" : "text-lg"} ${
                  idx === 0 ? "text-gray-600" : "text-gray-500"
                } leading-relaxed mb-6`}
              >
                {p}
              </p>
            ))}
            <p className="text-sage-700 font-medium text-lg">{content.introHighlight}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-sage-600 text-white rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-7 h-7" />
              {content.benefitsTitle}
            </h3>
            <ul className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-300 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blush-100 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-sage-800 mb-6 flex items-center gap-3">
              <Heart className="w-7 h-7 text-blush-600" />
              {content.approachTitle}
            </h3>
            {content.approachParagraphs.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === content.approachParagraphs.length - 1
                    ? "text-sage-700 font-medium"
                    : "text-gray-600 leading-relaxed mb-4"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="relative bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
          {syllabusEditSlot}
          <h3 className="text-2xl font-bold text-sage-800 mb-8 text-center">
            {content.syllabusTitle}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.syllabus.map((week) => (
              <div key={week.week} className="bg-warm-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-blush-600 mb-3">
                  <Calendar size={18} />
                  <span className="font-medium">{week.date}</span>
                </div>
                <h4 className="font-bold text-sage-800 mb-3">
                  שבוע {week.week}: {week.title}
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {week.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-sage-600 to-sage-700 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">{content.technicalTitle}</h3>
              <div className="space-y-4">
                {content.technicalDetails.map((detail, idx) => {
                  const Icon = iconMap[detail.icon] || Calendar;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-sage-300" />
                      <span>{detail.text}</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-warm-200">{content.technicalExtra}</p>
            </div>

            <div className="text-center">
              <p className="text-xl mb-6 text-warm-200">{content.ctaText}</p>
              <Button
                href={content.ctaHref}
                size="lg"
                className="bg-white !text-sage-700 hover:bg-warm-100"
              >
                {content.ctaButton}
              </Button>
              <p className="mt-4 text-warm-300 text-sm">{content.ctaSubtext}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
