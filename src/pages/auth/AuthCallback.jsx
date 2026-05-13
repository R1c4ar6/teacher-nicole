import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { url } = window.location;
      const params = new URLSearchParams(new URL(url).search);
      const error = params.get('error');
      const code = params.get('code');

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/login?error=' + encodeURIComponent(error));
        return;
      }

      if (code) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4 animate-spin" />
        <p className="text-[var(--color-text-secondary)]">Signing you in...</p>
      </div>
    </div>
  );
};