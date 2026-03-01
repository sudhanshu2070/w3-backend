import { Request, Response } from 'express';
import Course from '../models/Course';
import { AddCourseRequest } from '../types/course';

type UpdateCourseRequest = Partial<AddCourseRequest>;
interface GetCoursesQuery {
  course_id?: string;
}

export const getCourses = async (
  req: Request<undefined, any, undefined, GetCoursesQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { course_id } = req.query;

    let courses;

    if (course_id && typeof course_id === 'string' && course_id.trim() !== '') {
      // finding by course_id
      const course = await Course.findOne({ course_id: course_id.trim() });
      if (!course) {
        res
          .status(404)
          .json({ message: `Course with course_id "${course_id}" not found` });
        return;
      }
      courses = [course]; // in array for consistent response
    } else {
      // Returning all courses if course_id is missing/empty
      courses = await Course.find({}).sort({ created_at: -1 });
    }

    res.status(200).json(courses);
  } catch (err: any) {
    console.error('Get courses error:', err);
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

export const addCourse = async (
  req: Request<any, any, AddCourseRequest>,
  res: Response,
): Promise<void> => {
  try {
    const courseData: AddCourseRequest = req.body;

    // Checking if course with the same course_id already exists
    const existingCourse = await Course.findOne({
      course_id: courseData.course_id,
    });
    if (existingCourse) {
      res.status(409).json({
        message: `Course with course_id "${courseData.course_id}" already exists`,
      });
      return;
    }

    if (!courseData.title || !courseData.description || !courseData.course_id) {
      res
        .status(400)
        .json({ message: 'course_id, title and description are required' });
      return;
    }

    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    res
      .status(201)
      .json({ message: 'Course added successfully', course: savedCourse });
  } catch (err: any) {
    console.error('Add course error:', err);
    res
      .status(500)
      .json({ message: 'Error adding course', error: err.message });
  }
};

export const updateCourse = async (
  req: Request<{ course_id: string }, {}, UpdateCourseRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { course_id } = req.params;
    const updateData: UpdateCourseRequest = req.body;

    if (!course_id) {
      res.status(400).json({ message: 'Course ID is required' });
      return;
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { course_id },
      updateData,
      { new: true },
    );

    if (!updatedCourse) {
      res
        .status(404)
        .json({ message: `Course with ID "${course_id}" not found` });
      return;
    }

    res
      .status(200)
      .json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (err: any) {
    console.error('Update course error:', err);
    res
      .status(500)
      .json({ message: 'Error updating course', error: err.message });
  }
};
