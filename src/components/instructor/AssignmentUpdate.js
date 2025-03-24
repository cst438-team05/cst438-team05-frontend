import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

function AssignmentUpdate({ assignment, onClose, onAssignmentUpdated }) {
    const [title, setTitle] = useState(assignment.title);
    const [dueDate, setDueDate] = useState(formatDate(assignment.dueDate));
    const [message, setMessage] = useState('');

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            // Handle different date formats
            let date;
            if (dateStr.includes('/')) {
                // Convert DD/MM/YYYY to YYYY-MM-DD
                const [day, month, year] = dateStr.split('/');
                date = new Date(year, month - 1, day);
            } else {
                date = new Date(dateStr);
            }
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return '';
            }
            
            // Format to YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setMessage('Error: Title is required');
            return;
        }

        if (!dueDate) {
            setMessage('Error: Due date is required');
            return;
        }

        // Validate date format and range
        const formattedDate = formatDate(dueDate);
        if (!formattedDate) {
            setMessage('Error: Invalid date format');
            return;
        }

        const dueDateObj = new Date(formattedDate);
        const minDateObj = new Date(minDate);
        const maxDateObj = new Date(maxDate);

        if (dueDateObj < minDateObj || dueDateObj > maxDateObj) {
            setMessage('Error: Due date must be within the term dates');
            return;
        }

        const updatedAssignment = {
            id: assignment.id,
            title: title.trim(),
            dueDate: formattedDate,
            secNo: assignment.secNo
        };

        console.log('Updating assignment:', updatedAssignment);

        fetch(`${SERVER_URL}/assignments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedAssignment)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    try {
                        const errorData = JSON.parse(text);
                        throw new Error(errorData.message || 'Failed to update assignment');
                    } catch (e) {
                        throw new Error(text || 'Failed to update assignment');
                    }
                });
            }
            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            console.log('Update successful:', data);
            setMessage('Assignment updated successfully');
            onAssignmentUpdated();
            setTimeout(onClose, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
            setMessage('Error: ' + error.message);
        });
    };

    // Get min and max dates for the date input (Spring 2025 term)
    const minDate = '2025-01-15';
    const maxDate = '2025-05-15';

    return (
        <div>
            <h4>Update Assignment</h4>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            <div>
                <p>Assignment due date must be within term dates:</p>
                <ul>
                    <li>Term Start: January 15, 2025</li>
                    <li>Term End: May 15, 2025</li>
                </ul>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input 
                        type="date" 
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        min={minDate}
                        max={maxDate}
                        required
                    />
                    <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
                        Current format: YYYY-MM-DD
                    </small>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button type="submit">Update Assignment</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AssignmentUpdate;
