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
  const { year, semester } = location.state;

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async (year, semester) => {
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
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  useEffect(() => {
    fetchSections(year, semester);
  }, [year, semester]);

  return (
    <>
      <h3>Sections</h3>
      <h4>{message}</h4>
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
          {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.courseId}</td>
              <td>{s.secId}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td>
                <Link to="/assignments" state={s}>
                  View Assignments
                </Link>
              </td>
              <td>
                <Link to="/enrollments" state={s}>
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
