import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Button from '@mui/material/Button';

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
  const [editedEnrollments, setEditedEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        `${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
      );
      if (response.ok) {
        const enrollments = await response.json();
        setEnrollments(enrollments);
        setEditedEnrollments(JSON.parse(JSON.stringify(enrollments)));
      } else {
        const json = await response.json();
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  const onGradeChange = (index, value) => {
    const updated = [...editedEnrollments];
    updated[index].grade = value;
    setEditedEnrollments(updated);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/enrollments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEnrollments),
      });
      if (response.ok) {
        fetchEnrollments();
        setMessage('Grades saved successfully');
      } else {
        const json = await response.json();
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  const handleCancel = () => {
    setEditedEnrollments(JSON.parse(JSON.stringify(enrollments)));
    setMessage('Changes canceled');
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
        {editedEnrollments.map((e, index) => (
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
                  onGradeChange(index, event.target.value);
                }}
              />
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleCancel} style={{ marginLeft: '0.5rem' }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default EnrollmentsView;
