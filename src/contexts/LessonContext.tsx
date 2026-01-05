import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  status: 'not-started' | 'in-progress' | 'completed';
  content: {
    header: string;
    body: string;
  };
}

interface LessonContextType {
  lessons: Lesson[];
  updateLessonStatus: (id: string, status: Lesson['status']) => void;
  completeLesson: (id: string) => void;
  getProgressStats: () => {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
    percentage: number;
  };
}

const initialLessons: Lesson[] = [
  {
    id: 'kitab-kosong',
    title: 'Kitab Kosong',
    subtitle: 'Master Prompting',
    status: 'not-started',
    content: {
      header: 'Kitab Kosong: Struktur adalah Kekuatan',
      body: 'Rahasia SUHU adalah kejelasan. Gunakan rumus: [Subjek] + [Aksi] + [Pencahayaan]. Contoh: A cat sleeping on a table, warm sunlight.',
    },
  },
  {
    id: 'tapak-setapak',
    title: 'Tapak Setapak',
    subtitle: 'Iteration',
    status: 'not-started',
    content: {
      header: 'Tapak Setapak: Langkah Demi Langkah',
      body: 'Setiap iterasi membawa kemajuan. Jangan takut untuk mencoba, memperbaiki, dan mencoba lagi. Kesempurnaan lahir dari pengulangan yang bijak.',
    },
  },
  {
    id: 'boneka-bayangan',
    title: 'Boneka Bayangan',
    subtitle: 'Custom Agents',
    status: 'not-started',
    content: {
      header: 'Boneka Bayangan: Menciptakan Asisten Digital',
      body: 'Agent adalah perpanjangan dari kehendakmu. Tentukan peran, berikan konteks, dan biarkan mereka bekerja. Kekuatan sejati adalah delegasi yang bijaksana.',
    },
  },
];

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  // Load user-specific lesson progress from localStorage
  useEffect(() => {
    if (user) {
      const storedProgress = localStorage.getItem(
        `padepokan_lessons_${user.id}`
      );
      if (storedProgress) {
        try {
          const userLessons = JSON.parse(storedProgress);
          setLessons(userLessons);
        } catch (error) {
          console.error('Error parsing stored lesson progress:', error);
          localStorage.removeItem(`padepokan_lessons_${user.id}`);
        }
      } else {
        // Initialize with default lessons for new user
        localStorage.setItem(
          `padepokan_lessons_${user.id}`,
          JSON.stringify(initialLessons)
        );
      }
    } else {
      // Reset to initial lessons when no user is logged in
      setLessons(initialLessons);
    }
  }, [user]);

  const updateLessonStatus = (id: string, status: Lesson['status']) => {
    setLessons((prev) => {
      const updatedLessons = prev.map((lesson) =>
        lesson.id === id ? { ...lesson, status } : lesson
      );

      // Save to localStorage if user is logged in
      if (user) {
        localStorage.setItem(
          `padepokan_lessons_${user.id}`,
          JSON.stringify(updatedLessons)
        );
      }

      return updatedLessons;
    });
  };

  const completeLesson = (id: string) => {
    updateLessonStatus(id, 'completed');
  };

  const getProgressStats = () => {
    const completed = lessons.filter((l) => l.status === 'completed').length;
    const inProgress = lessons.filter((l) => l.status === 'in-progress').length;
    const notStarted = lessons.filter((l) => l.status === 'not-started').length;
    const total = lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      inProgress,
      notStarted,
      total,
      percentage,
    };
  };

  return (
    <LessonContext.Provider
      value={{ lessons, updateLessonStatus, completeLesson, getProgressStats }}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLessons must be used within a LessonProvider');
  }
  return context;
}
