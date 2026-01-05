import { useNavigate } from 'react-router-dom';
import { Lesson } from '@/contexts/LessonContext';
import { CircuitButton } from './CircuitButton';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const navigate = useNavigate();

  const statusLabels = {
    'not-started': 'Belum Dimulai',
    'in-progress': 'Sedang Berjalan',
    'completed': 'Selesai',
  };

  const statusStyles = {
    'not-started': 'status-not-started',
    'in-progress': 'status-in-progress',
    'completed': 'status-completed',
  };

  return (
    <div
      className={cn(
        'lesson-card',
        lesson.status === 'completed' && 'completed'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-serif text-foreground mb-1">
            {lesson.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {lesson.subtitle}
          </p>
          <span
            className={cn(
              'text-xs font-medium uppercase tracking-wider',
              statusStyles[lesson.status]
            )}
          >
            {statusLabels[lesson.status]}
          </span>
        </div>
        <CircuitButton
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className="sm:w-auto w-full"
        >
          Buka Kitab
        </CircuitButton>
      </div>
    </div>
  );
}
