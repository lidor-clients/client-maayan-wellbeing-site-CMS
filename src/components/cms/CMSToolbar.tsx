import { Settings, LogOut } from 'lucide-react';

interface Props {
  onLogout: () => void;
}

export default function CMSToolbar({ onLogout }: Props) {
  return (
    <div className="fixed top-0 right-0 left-0 z-[60] bg-sage-800 text-white h-10 flex items-center px-4 justify-between text-sm shadow-lg">
      <div className="flex items-center gap-2">
        <Settings size={16} />
        <span className="font-medium">מצב עריכה</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sage-300">לחצי על עיפרון כדי לערוך סקשן</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-sage-300 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>יציאה</span>
        </button>
      </div>
    </div>
  );
}
