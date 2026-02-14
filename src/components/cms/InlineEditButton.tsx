import { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditPanel from './EditPanel';
import type { FieldConfig } from './EditableSection';

interface Props {
  label: string;
  data: Record<string, unknown>;
  fieldConfigs: FieldConfig[];
  onSave: (data: Record<string, unknown>) => void;
}

export default function InlineEditButton({ label, data, fieldConfigs, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 left-4 z-[55] bg-sage-600 text-white p-3 rounded-full shadow-xl hover:bg-sage-700 hover:scale-110 transition-all duration-200 cursor-pointer flex items-center gap-2"
        title={`ערכי את ${label}`}
      >
        <Pencil size={18} />
        <span className="text-sm font-medium pl-1">{label}</span>
      </button>

      {isEditing && (
        <EditPanel
          title={label}
          data={data}
          fieldConfigs={fieldConfigs}
          onSave={onSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
