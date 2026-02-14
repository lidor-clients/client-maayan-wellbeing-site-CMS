import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import FieldEditor from './FieldEditor';
import type { FieldConfig } from './EditableSection';

interface Props {
  title: string;
  data: Record<string, unknown>;
  fieldConfigs: FieldConfig[];
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function EditPanel({ title, data, fieldConfigs, onSave, onClose }: Props) {
  const [localData, setLocalData] = useState<Record<string, unknown>>(data);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-save with debounce
  const debouncedSave = useCallback((newData: Record<string, unknown>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave(newData);
    }, 500);
  }, [onSave]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleFieldChange = (key: string, value: unknown) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    debouncedSave(newData);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[70]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-[420px] max-w-[90vw] bg-white shadow-2xl z-[80] flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-sage-50">
          <h3 className="text-lg font-bold text-sage-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-sage-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-4" dir="rtl">
          {fieldConfigs.map((config) => (
            <FieldEditor
              key={config.key}
              config={config}
              value={localData[config.key]}
              onChange={(value) => handleFieldChange(config.key, value)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <span className="text-xs text-gray-400">השינויים נשמרים אוטומטית</span>
        </div>
      </div>
    </>
  );
}
