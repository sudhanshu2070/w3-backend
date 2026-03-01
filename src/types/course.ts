export interface Course {
  course_id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  instructor: string;
  category: string;
  registration_url?: string;
  zoom_link?: string;
  start_date?: string;
  end_date?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetCoursesQuery {
  course_id?: string;
}

export interface AddCourseRequest {
  course_id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  instructor: string;
  category: string;
  registration_url?: string;
  zoom_link?: string;
  start_date?: string;
  end_date?: string;
  is_published?: boolean;
}

export type UpdateCourseRequest = Partial<AddCourseRequest>;
