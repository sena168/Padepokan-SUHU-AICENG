import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleOAuth } from '@/utils/googleOAuth';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const signUpSchema = z
  .object({
    nickname: z
      .string()
      .min(2, 'Nama minimal 2 karakter')
      .max(50, 'Nama maksimal 50 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

const signInSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi diperlukan'),
});

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      onOpenChange(false);
      navigate('/dashboard');
    }
  };

  const resetForm = () => {
    setNickname('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isSignUp) {
        signUpSchema.parse({ nickname, email, password, confirmPassword });
        const success = await signup(nickname, email, password);
        if (!success) {
          setErrors({ email: 'Email sudah terdaftar' });
          return;
        }
      } else {
        signInSchema.parse({ email, password });
        const success = await login(email, password);
        if (!success) {
          setErrors({ email: 'Email atau kata sandi salah' });
          return;
        }
      }
      onOpenChange(false);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='scroll-container border-none p-8 pt-12 pb-12 max-w-md'>
        <DialogHeader className='mb-6'>
          <DialogTitle className='text-2xl text-center font-serif text-deep-purple'>
            {isSignUp ? 'Daftar Murid Baru' : 'Masuk ke Padepokan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {isSignUp && (
            <div className='space-y-2'>
              <Label
                htmlFor='nickname'
                className='text-deep-purple font-medium'
              >
                Nama Murid
              </Label>
              <Input
                id='nickname'
                type='text'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className='bg-parchment-dark border-deep-purple/30 text-deep-purple placeholder:text-deep-purple/50'
                placeholder='Masukkan nama panggilanmu'
              />
              {errors.nickname && (
                <p className='text-sm text-red-600'>{errors.nickname}</p>
              )}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email' className='text-deep-purple font-medium'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-parchment-dark border-deep-purple/30 text-deep-purple placeholder:text-deep-purple/50'
              placeholder='Masukkan email'
            />
            {errors.email && (
              <p className='text-sm text-red-600'>{errors.email}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password' className='text-deep-purple font-medium'>
              Kata Sandi
            </Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-parchment-dark border-deep-purple/30 text-deep-purple placeholder:text-deep-purple/50'
              placeholder='Masukkan kata sandi'
            />
            {errors.password && (
              <p className='text-sm text-red-600'>{errors.password}</p>
            )}
          </div>

          {isSignUp && (
            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='text-deep-purple font-medium'
              >
                Konfirmasi Kata Sandi
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='bg-parchment-dark border-deep-purple/30 text-deep-purple placeholder:text-deep-purple/50'
                placeholder='Ulangi kata sandi'
              />
              {errors.confirmPassword && (
                <p className='text-sm text-red-600'>{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='circuit-btn w-full py-3 px-6 rounded-lg text-secondary-foreground font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading
              ? 'Memproses...'
              : isSignUp
              ? 'Daftar Murid Baru'
              : 'Masuk Padepokan'}
          </button>

          {GoogleOAuth.isConfigured() && (
            <div className='flex flex-col space-y-3'>
              <div className='relative flex items-center'>
                <div className='flex-grow border-t border-deep-purple/30'></div>
                <span className='flex-shrink mx-4 text-deep-purple/70 text-sm'>
                  atau
                </span>
                <div className='flex-grow border-t border-deep-purple/30'></div>
              </div>

              <button
                type='button'
                onClick={handleGoogleLogin}
                className='flex items-center justify-center w-full py-3 px-6 rounded-lg border border-deep-purple/30 bg-white text-deep-purple font-semibold tracking-wide hover:bg-gray-50 transition-colors'
              >
                <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Masuk dengan Google
              </button>
            </div>
          )}

          <div className='flex justify-end pt-2'>
            <button
              type='button'
              onClick={toggleMode}
              className='text-sm text-deep-purple/70 hover:text-deep-purple transition-colors underline-offset-2 hover:underline'
            >
              {isSignUp
                ? 'Sudah punya akun? Masuk'
                : 'Belum punya akun? Daftar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
