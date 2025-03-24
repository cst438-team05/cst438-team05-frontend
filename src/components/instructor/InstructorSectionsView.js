import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

// instructor views a list of sections they are teaching
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const INSTRUCTOR_EMAIL = 'dwisneski@csumb.edu';

const InstructorSectionsView = (props) => {
  // get year and semester from location state
  const location = useLocation();
  const { year, semester } = location.state || { year: '', semester: '' };

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async (year, semester) => {
    if (!year || !semester) {
      setMessage('Please provide both year and semester');
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/sections?email=${INSTRUCTOR_EMAIL}&year=${year}&semester=${semester}`,
      );
      if (response.ok) {
        const sections = await response.json();
        setSections(sections);
        setMessage('');
      } else {
        const json = await response.json();
        setMessage('Response error: ' + json.message);
      }
    } catch (err) {
      setMessage('Network error: ' + err);
    }
  };

  useEffect(() => {
    fetchSections(year, semester);
  }, [year, semester]);

  return (
    <>
      <h3>Sections</h3>
      {message && <h4>{message}</h4>}
      <table className="Center">
        <thead>
          <tr>
            <th>Section No</th>
            <th>Course Id</th>
            <th>Section Id</th>
            <th>Building</th>
            <th>Room</th>
            <th>Times</th>
            <th>Assignments</th>
            <th>Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.secNo}>
              <td>{section.secNo}</td>
              <td>{section.courseId}</td>
              <td>{section.secId}</td>
              <td>{section.building}</td>
              <td>{section.room}</td>
              <td>{section.times}</td>
              <td>
                <Link 
                  to="/assignments" 
                  state={section}
                >
                  View Assignments
                </Link>
              </td>
              <td>
                <Link 
                  to="/enrollments" 
                  state={section}
                >
                  View Enrollments
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InstructorSectionsView;
