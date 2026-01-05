import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const GoogleCallback = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = await loginWithGoogle();
        if (success) {
          navigate('/dashboard');
        } else {
          navigate('/?error=google_auth_failed');
        }
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        navigate('/?error=google_auth_error');
      }
    };

    handleCallback();
  }, [loginWithGoogle, navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-lg font-medium'>
          Processing Google authentication...
        </p>
        <p className='text-sm text-gray-600 mt-2'>
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
