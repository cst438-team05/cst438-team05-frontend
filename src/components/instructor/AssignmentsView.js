import React, { useState, useEffect, useCallback } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import { useLocation } from 'react-router-dom';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Button from '@mui/material/Button';

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

function AssignmentsView() {
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showGradeForm, setShowGradeForm] = useState(false);

    const location = useLocation();
    const section = location.state;

    const fetchAssignments = useCallback(() => {
        if (!section?.secNo) {
            return;
        }

        fetch(`${GRADEBOOK_URL}/sections/${section.secNo}/assignments`)
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }
                return response.json();
            })
            .then(data => {
                setAssignments(data);
                setMessage('');
            })
            .catch(error => {
                setMessage('Error: ' + error.message);
            });
    }, [section?.secNo]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleDelete = (assignmentId) => {
        fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    fetchAssignments();
                    setMessage('Assignment deleted successfully');
                } else {
                    setMessage('Error deleting assignment');
                }
            })
            .catch(error => {
                setMessage('Error: ' + error.message);
            });
    };

    const handleGradeClose = () => {
        setShowGradeForm(false);
        fetchAssignments();
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px 0'
    };

    const tableStyle = {
        margin: '0 auto',
        width: '60%',
        borderCollapse: 'collapse'
    };

    const cellStyle = {
        padding: '4px 8px',
        textAlign: 'left'
    };

    return (
        <div style={containerStyle}>
            <h3>Assignments for Section {section?.secNo}</h3>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            {assignments.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={cellStyle}>Title</th>
                            <th style={cellStyle}>Due Date</th>
                            <th style={cellStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.id}>
                                <td style={cellStyle}>{assignment.title}</td>
                                <td style={cellStyle}>{assignment.dueDate}</td>
                                <td style={cellStyle}>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      size="small"
                                      onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setShowUpdateForm(true);
                                      }}
                                      style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setShowGradeForm(true);
                                      }}
                                      style={{ marginRight: '5px' }}
                                    >
                                        Grade
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      onClick={() => handleDelete(assignment.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments found for this section.</p>
            )}

            {section?.secNo && (
                <Button
                  variant="contained"
                  style={{ marginTop: '20px' }}
                  onClick={() => setShowAddForm(true)}
                >
                    Add Assignment
                </Button>
            )}

            {showAddForm && section?.secNo && (
                <AssignmentAdd 
                    secNo={section.secNo}
                    onClose={() => setShowAddForm(false)}
                    onAssignmentAdded={fetchAssignments}
                />
            )}

            {showUpdateForm && selectedAssignment && (
                <AssignmentUpdate
                    assignment={selectedAssignment}
                    onClose={() => setShowUpdateForm(false)}
                    onAssignmentUpdated={fetchAssignments}
                />
            )}

            {showGradeForm && selectedAssignment && (
                <AssignmentGrade
                    assignment={selectedAssignment}
                    onClose={handleGradeClose}
                />
            )}
        </div>
    );
}

export default AssignmentsView;
