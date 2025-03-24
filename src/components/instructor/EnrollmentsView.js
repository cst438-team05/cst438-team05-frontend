import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {
  // get section number from location state (courseId and secId are also available, but not needed)
  const location = useLocation();
  const { secNo } = location.state;

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/sections/${secNo}/enrollments`,
      );
      if (response.ok) {
        const enrollments = await response.json();
        setEnrollments(enrollments);
      } else {
        const json = await response.json();
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  const onGradeChange = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/enrollments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollments),
      });
      if (response.ok) {
        fetchEnrollments();
      } else {
        const json = await response.json();
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <>
      <h3>Enrollments</h3>
      <h4>{message}</h4>
      <table className="Center">
        <thead>
          <tr>
            <th>Enrollment Id</th>
            <th>Student Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>
                <input
                  type="text"
                  name="grade"
                  value={e.grade ?? ''}
                  onChange={(event) => {
                    e.grade = event.target.value;
                    onGradeChange();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EnrollmentsView;
