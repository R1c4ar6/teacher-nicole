import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import supabase from '../../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/auth/login');
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Session exchange error:', error);
            navigate('/auth/login');
            return;
          }

          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        navigate('/auth/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4 animate-spin" />
        <p className="text-[var(--color-text-secondary)]">
          Signing you in...
        </p>
      </div>
    </div>
  );
};