import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';
import Button from '@mui/material/Button';
import { getAuthHeader } from '../../auth/getAuthHeader';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

function AssignmentGrade({ assignment, onClose }) {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchGrades();
    }, [assignment.id]);

    const fetchGrades = () => {
        fetch(`${SERVER_URL}/assignments/${assignment.id}/grades`, {
            headers: {
                ...getAuthHeader()
            }
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch grades');
                }
                return response.json();
            })
            .then(data => {
                setGrades(data);
                setMessage('');
            })
            .catch(() => {
                setMessage('Error fetching grades');
            });
    };

    const handleGradeChange = (gradeId, newScore) => {
        const updatedGrades = grades.map(grade => 
            grade.gradeId === gradeId 
                ? { ...grade, score: newScore } 
                : grade
        );
        setGrades(updatedGrades);
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        const updatedGrades = grades.map(grade => ({
            gradeId: grade.gradeId,
            score: parseInt(grade.score) || 0
        }));

        fetch(`${SERVER_URL}/grades`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(updatedGrades)
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error('Failed to save grades');
            }
            setMessage('Grades saved successfully');
            setTimeout(onClose, 1500);
        })
        .catch(() => {
            setMessage('Error saving grades');
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h4>Grade Assignment: {assignment.title}</h4>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            <form onSubmit={handleSave}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Student Name</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.length > 0 ? (
                            grades.map(grade => (
                                <tr key={grade.gradeId}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{grade.studentName}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{grade.studentEmail}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={grade.score || ''}
                                            onChange={e => handleGradeChange(grade.gradeId, e.target.value)}
                                            style={{ width: '60px', padding: '5px' }}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ padding: '10px', textAlign: 'center' }}>No students enrolled in this section</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div style={{ marginTop: '20px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      type="submit" style={{ marginRight: '10px' }}
                    >
                        Save Grades
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      type="button" onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AssignmentGrade;
