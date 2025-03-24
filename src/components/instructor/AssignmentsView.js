import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../../Constants';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const [sectionWithDates, setSectionWithDates] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const section = location.state;

    useEffect(() => {
        if (!section || !section.secNo) {
            setMessage('No section selected. Please select a section from the Sections page.');
            return;
        }
        console.log('Current section:', section);
        
        // Fetch section details
        fetch(`${SERVER_URL}/sections/${section.secNo}`)
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Failed to fetch section details');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched section details:', data);
                // For Spring 2025 (term_id 6)
                setSectionWithDates({
                    ...section,
                    startDate: '2025-01-15',
                    endDate: '2025-05-15'
                });
            })
            .catch(error => {
                console.error('Error fetching section details:', error);
                setMessage('Error: ' + error.message);
                // Set default dates for Spring 2025
                setSectionWithDates({
                    ...section,
                    startDate: '2025-01-15',
                    endDate: '2025-05-15'
                });
            });
    }, [section]);

    const fetchAssignments = useCallback(() => {
        if (!section?.secNo) {
            return;
        }
        console.log('Fetching assignments for section:', section.secNo);

        fetch(`${SERVER_URL}/sections/${section.secNo}/assignments`)
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Failed to fetch assignments');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched assignments:', data);
                setAssignments(data);
                setMessage('');
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
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
        // Refresh assignments after grading
        fetchAssignments();
    };

    return (
        <div>
            <h3>Assignments for Section {section?.secNo}</h3>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            {section?.secNo && (
                <button onClick={() => setShowAddForm(true)}>Add Assignment</button>
            )}
            
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

            {showAddForm && section?.secNo && sectionWithDates && (
                <AssignmentAdd 
                    secNo={section.secNo}
                    startDate={sectionWithDates.startDate}
                    endDate={sectionWithDates.endDate}
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
