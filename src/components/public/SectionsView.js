import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

function SectionsView() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/sections/public')
      .then(response => response.json())
      .then(data => setSections(data))
      .catch(error => console.error('Error fetching sections:', error));
  }, []);

  return (
    <div>
      <h2>Available Sections</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Section</th>
            <th>Instructor</th>
            <th>Building</th>
            <th>Room</th>
            <th>Times</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(section => (
            <tr key={section.secNo}>
              <td>{section.courseId}</td>
              <td>{section.title}</td>
              <td>{section.secId}</td>
              <td>{section.instructorName}</td>
              <td>{section.building}</td>
              <td>{section.room}</td>
              <td>{section.times}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SectionsView; 