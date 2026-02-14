interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  light = false
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-sage-800'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-warm-200' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-24 h-1 ${light ? 'bg-blush-400' : 'bg-sage-400'} mt-6 ${centered ? 'mx-auto' : ''} rounded-full`} />
    </div>
  );
}
