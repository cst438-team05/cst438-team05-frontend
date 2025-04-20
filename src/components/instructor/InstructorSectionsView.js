import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import { getAuthHeader } from '../../auth/getAuthHeader';

// instructor views a list of sections they are teaching
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
  const location = useLocation();
  const { year, semester } = location.state;

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = useCallback(async () => {
    if (!year || !semester) {
      setMessage('Please provide both year and semester');
      return;
    }
    try {
      const url = `${SERVER_URL}/sections?year=${year}&semester=${semester}`;
      let response;
      try {
        response = await fetch(url, {
          headers: {
            ...getAuthHeader()
          }
        });
      } catch (networkError) {
        throw new Error('Cannot connect to backend server - is it running?');
      }
      
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      setSections(data);
      setMessage('');
    } catch (err) {
      const errorMessage = `Error: ${err.message}`;
      setMessage(errorMessage);
    }
  }, [year, semester]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return (
    <>
      <h3>Sections for {semester} {year}</h3>
      {message && <h4>{message}</h4>}    
      {sections.length > 0 ? (
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
      ) : (
        <p>No sections found for {semester} {year}</p>
      )}
    </>
  );
};

export default InstructorSectionsView;
