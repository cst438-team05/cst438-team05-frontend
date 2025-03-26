import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../../Constants';
import { useLocation } from 'react-router-dom';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';

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

        fetch(`${SERVER_URL}/sections/${section.secNo}/assignments`)
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
        fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleGradeClose = () => {
        setShowGradeForm(false);
        fetchAssignments();
    };

    return (
        <div>
            <h3>Assignments for Section {section?.secNo}</h3>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            {assignments.length > 0 ? (
                <table style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.id}>
                                <td>{assignment.title}</td>
                                <td>{formatDate(assignment.dueDate)}</td>
                                <td>
                                    <button onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setShowUpdateForm(true);
                                    }}>Edit</button>
                                    <button onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setShowGradeForm(true);
                                    }}>Grade</button>
                                    <button onClick={() => handleDelete(assignment.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments found for this section.</p>
            )}

            {section?.secNo && (
                <button onClick={() => setShowAddForm(true)}>Add Assignment</button>
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
