import { useParams, useNavigate } from 'react-router-dom';
import { useLessons } from '@/contexts/LessonContext';
import { ScrollContainer } from '@/components/ScrollContainer';
import { CircuitButton } from '@/components/CircuitButton';

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { lessons, completeLesson } = useLessons();

  const lesson = lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">
            Kitab tidak ditemukan
          </h1>
          <CircuitButton onClick={() => navigate('/dashboard')}>
            Kembali ke Dashboard
          </CircuitButton>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    completeLesson(lesson.id);
    navigate('/dashboard');
  };

  const isCompleted = lesson.status === 'completed';

  return (
    <div className="min-h-screen bg-background circuit-trace relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-8 flex items-center justify-between border-b border-border">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span>
            <span>Kembali</span>
          </button>
          <h1 className="text-lg md:text-xl font-serif text-foreground">
            {lesson.title}
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-10 max-w-3xl mx-auto w-full flex flex-col">
          {/* Lesson Title */}
          <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-2">
            {lesson.content.header}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {lesson.subtitle}
          </p>

          {/* Scroll Content */}
          <ScrollContainer className="flex-1">
            <div className="py-6 px-4 text-center leading-relaxed text-lg">
              {lesson.content.body}
            </div>
          </ScrollContainer>

          {/* Completion Status Indicator */}
          {isCompleted && (
            <div className="mt-6 text-center">
              <span className="text-secondary font-medium">
                Latihan ini telah diselesaikan
              </span>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 px-8 text-center border-t border-border">
          <CircuitButton
            onClick={handleComplete}
            className="text-lg px-12 py-4"
            disabled={isCompleted}
          >
            {isCompleted ? 'Sudah Selesai' : 'Selesaikan Latihan'}
          </CircuitButton>
        </footer>
      </div>
    </div>
  );
};

export default LessonPage;
