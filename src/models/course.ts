export interface Course {
  thumbnailUrl: string;
  title: string;
  instructor: string;
  price: string;
  duration: string;
  id: number;
  description: string;
}

export type Lesson = {
  id: number;
  content: string;
  contentPlain: string;
  thumbnailUrl: string;
  title: string;
  asset?: {
    url: string;
    contentType: 'image' | 'video';
    duration?: number | null;
  } | null;
};

export type completedLesson = {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: null;
  created_at: Date;
  updated_at: Date;
};
