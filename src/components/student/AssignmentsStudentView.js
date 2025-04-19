import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { getAuthHeader } from '../../auth/getAuthHeader';

// student views a list of assignments and assignment grades
// use the URL  /assignments?year= &semester=
// The REST api returns a list of SectionDTO objects

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  // year and semester for the assignments
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  // fetch assignments for a student
  const fetchAssignments = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${SERVER_URL}/assignments?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
            ...getAuthHeader(),
          },
        },
      );
      if (response.ok) {
        const assignments = await response.json();
        setAssignments(assignments);
        setMessage('');
      } else {
        const json = await response.json();
        setMessage('response error: ' + json.message);
      }
    } catch (err) {
      setMessage('network error: ' + err);
    }
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>Assignments</h2>
      <form
        style={{
          margin: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'baseline',
        }}
        onSubmit={fetchAssignments}
      >
        <TextField
          label="Year"
          name="year"
          variant="standard"
          required
          value={year}
          onChange={(event) => setYear(event.target.value)}
        />
        <TextField
          label="Semester"
          name="semester"
          variant="standard"
          required
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
        />
        <Button type="submit" variant="contained">
          Fetch Assignments
        </Button>
      </form>
      <h3 style={{ color: 'red' }}>{message}</h3>

      {assignments.length === 0 ? (
        <h3>
          No assignments found for {semester} {year}
        </h3>
      ) : (
        <TableContainer component={Paper} style={{ width: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Id</TableCell>
                <TableCell>Assignment Title</TableCell>
                <TableCell>Assignment DueDate</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.assignmentId}>
                  <TableCell>{assignment.courseId}</TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell align="right">{assignment.dueDate}</TableCell>
                  <TableCell align="right">{assignment.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AssignmentsStudentView;
