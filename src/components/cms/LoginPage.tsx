import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const err = await login(password);
    if (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-sage-600" />
            </div>
            <h1 className="text-2xl font-bold text-sage-800">ניהול תוכן</h1>
            <p className="text-gray-500 mt-2">הכניסי את הסיסמה כדי לערוך את האתר</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="סיסמה"
                required
                autoFocus
                className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-center text-lg"
                dir="rtl"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'מתחברת...' : 'כניסה'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
