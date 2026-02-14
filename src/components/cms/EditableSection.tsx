import { useState, type ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import EditPanel from './EditPanel';
import type { SiteContent } from '../../types/content';
import { useContent } from '../../context/ContentContext';

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'list' | 'object-list' | 'image';
  fields?: FieldConfig[];
}

interface Props {
  children: ReactNode;
  sectionKey: keyof SiteContent;
  sectionLabel: string;
  fieldConfigs: FieldConfig[];
}

export default function EditableSection({ children, sectionKey, sectionLabel, fieldConfigs }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { content, updateSection } = useContent();

  if (!content) return <>{children}</>;

  const sectionData = content[sectionKey];

  return (
    <div className="relative">
      {children}

      {/* Edit button - always visible in CMS mode */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 left-4 z-[55] bg-sage-600 text-white p-3 rounded-full shadow-xl hover:bg-sage-700 hover:scale-110 transition-all duration-200 cursor-pointer flex items-center gap-2"
        title={`ערכי את ${sectionLabel}`}
      >
        <Pencil size={18} />
        <span className="text-sm font-medium pl-1">{sectionLabel}</span>
      </button>

      {/* Edit panel */}
      {isEditing && (
        <EditPanel
          title={sectionLabel}
          data={sectionData as unknown as Record<string, unknown>}
          fieldConfigs={fieldConfigs}
          onSave={(newData) => {
            updateSection(sectionKey, newData as unknown as SiteContent[typeof sectionKey]);
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export type { FieldConfig };
