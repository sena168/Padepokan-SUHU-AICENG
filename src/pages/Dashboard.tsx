import { useNavigate } from 'react-router-dom';
import { useLessons } from '@/contexts/LessonContext';
import { useAuth } from '@/contexts/AuthContext';
import { LessonCard } from '@/components/LessonCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lessons } = useLessons();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-background circuit-trace relative overflow-hidden'>
      {/* Ambient glow effects */}
      <div className='absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow' />
      <div className='absolute bottom-20 left-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse-glow' />

      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Header */}
        <header className='py-6 px-8 flex items-center justify-between border-b border-border'>
          <h1 className='text-xl md:text-2xl font-serif text-foreground'>
            Padepokan SUHU AICENG
          </h1>
          <button
            onClick={handleLogout}
            className='text-muted-foreground hover:text-foreground transition-colors text-sm'
          >
            Keluar
          </button>
        </header>

        {/* Main Content */}
        <main className='flex-1 px-4 md:px-8 py-10 max-w-4xl mx-auto w-full'>
          {/* Welcome Message */}
          <div className='mb-10'>
            <h2 className='text-2xl md:text-3xl font-serif text-foreground mb-2'>
              Halo {user?.nickname || 'Kawan'}, siap melanjutkan latihan hari
              ini?
            </h2>
            <p className='text-muted-foreground'>
              Pilih salah satu kitab untuk melanjutkan perjalananmu.
            </p>
          </div>

          {/* Lesson Catalog */}
          <div className='space-y-4'>
            <h3 className='text-lg font-serif text-foreground mb-4'>
              Katalog Kitab
            </h3>
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className='py-6 px-8 text-center border-t border-border'>
          <p className='text-muted-foreground text-sm'>
            Padepokan SUHU AICENG - Menenun Sutra Digital
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
