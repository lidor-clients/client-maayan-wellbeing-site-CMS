import { useState } from 'react';
import { Plus, Trash2, Upload, ImageIcon } from 'lucide-react';
import type { FieldConfig } from './EditableSection';
import { useAuth } from '../../context/AuthContext';

interface Props {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}

export default function FieldEditor({ config, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  if (config.type === 'image') {
    const imageUrl = (value as string) ?? '';
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
        {imageUrl ? (
          <div className="relative mb-2">
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 mb-2">
            <ImageIcon size={32} />
          </div>
        )}
        <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
          uploading ? 'bg-gray-200 text-gray-500' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
        }`}>
          <Upload size={16} />
          {uploading ? 'מעלה...' : 'העלי תמונה'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              const formData = new FormData();
              formData.append('image', file);
              try {
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const res = await fetch('/api/upload', { method: 'POST', headers, body: formData });
                const data = await res.json();
                onChange(data.url);
              } catch (err) {
                console.error('Upload failed:', err);
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>
      </div>
    );
  }

  if (config.type === 'text') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm"
          dir="rtl"
        />
      </div>
    );
  }

  if (config.type === 'textarea') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm resize-y"
          dir="rtl"
        />
      </div>
    );
  }

  if (config.type === 'list') {
    const items = (value as string[]) ?? [];
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx] = e.target.value;
                  onChange(newItems);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => {
                  const newItems = items.filter((_, i) => i !== idx);
                  onChange(newItems);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...items, ''])}
            className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            <Plus size={16} />
            הוסיפי פריט
          </button>
        </div>
      </div>
    );
  }

  if (config.type === 'object-list' && config.fields) {
    const items = (value as Record<string, unknown>[]) ?? [];
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{config.label}</label>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = items.filter((_, i) => i !== idx);
                    onChange(newItems);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {config.fields!.map((field) => (
                <FieldEditor
                  key={field.key}
                  config={field}
                  value={item[field.key]}
                  onChange={(newVal) => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], [field.key]: newVal };
                    onChange(newItems);
                  }}
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newItem: Record<string, unknown> = {};
              config.fields!.forEach(f => {
                newItem[f.key] = f.type === 'list' ? [] : f.type === 'object-list' ? [] : '';
              });
              onChange([...items, newItem]);
            }}
            className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            <Plus size={16} />
            הוסיפי פריט
          </button>
        </div>
      </div>
    );
  }

  return null;
}
