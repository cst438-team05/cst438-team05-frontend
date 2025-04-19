import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { fetchWithAuth } from '../../utils/api';

function CoursesView() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8080/courses');
        if (response) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Available Courses</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.courseId}>
              <td>{course.courseId}</td>
              <td>{course.title}</td>
              <td>{course.credits}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CoursesView; 