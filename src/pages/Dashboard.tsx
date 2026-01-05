import { useNavigate } from 'react-router-dom';
import { useLessons } from '@/contexts/LessonContext';
import { useAuth } from '@/contexts/AuthContext';
import { LessonCard } from '@/components/LessonCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lessons, getProgressStats } = useLessons();
  const { user, logout } = useAuth();

  const progressStats = getProgressStats();

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
          <div className='flex items-center gap-4'>
            <h1 className='text-xl md:text-2xl font-serif text-foreground'>
              Padepokan SUHU AICENG
            </h1>
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.nickname}
                className='w-8 h-8 rounded-full'
              />
            )}
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>
              {user?.nickname || 'Pengguna'}
            </span>
            <button
              onClick={handleLogout}
              className='text-muted-foreground hover:text-foreground transition-colors text-sm'
            >
              Keluar
            </button>
          </div>
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

            {/* Progress Overview */}
            <div className='mt-6 bg-secondary/10 rounded-lg p-6 max-w-md'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  Progress Keseluruhan
                </span>
                <span className='text-sm font-medium text-primary'>
                  {progressStats.percentage}%
                </span>
              </div>
              <div className='w-full bg-secondary/20 rounded-full h-2 mb-4'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progressStats.percentage}%` }}
                ></div>
              </div>

              {/* Progress Statistics */}
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-xl font-bold text-primary'>
                    {progressStats.completed}
                  </div>
                  <div className='text-xs text-muted-foreground'>Selesai</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-yellow-500'>
                    {progressStats.inProgress}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Dalam Proses
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-muted-foreground'>
                    {progressStats.notStarted}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Belum Dimulai
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Catalog */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-serif text-foreground'>
                Katalog Kitab
              </h3>
              <span className='text-sm text-muted-foreground'>
                {progressStats.total} kitab tersedia
              </span>
            </div>
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}

            {/* Completion Message */}
            {progressStats.percentage === 100 && (
              <div className='mt-8 text-center p-6 bg-primary/10 rounded-lg border border-primary/20'>
                <div className='text-2xl font-serif text-primary mb-2'>
                  🎉 Selamat!
                </div>
                <p className='text-muted-foreground'>
                  Kamu telah menyelesaikan semua kitab. Teruslah berlatih untuk
                  mengasah kemampuanmu!
                </p>
              </div>
            )}
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
