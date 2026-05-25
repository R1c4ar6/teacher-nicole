import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import supabase from '../../lib/supabase';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth/login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
        <p className="text-text-secondary">
          Signing you in...
        </p>
      </div>
    </div>
  );
};