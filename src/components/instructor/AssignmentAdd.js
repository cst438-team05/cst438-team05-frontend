import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

function AssignmentAdd({ secNo, startDate, endDate, onClose, onAssignmentAdded }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

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

        const assignment = {
            title: title.trim(),
            dueDate: formatDate(dueDate),
            secNo: parseInt(secNo)
        };

        console.log('Sending assignment:', assignment);

        fetch(`${SERVER_URL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment)
        })
        .then(async response => {
            const text = await response.text();
            console.log('Response:', text);
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(text);
                    if (errorData.message.includes("Due date must be between start and end date")) {
                        throw new Error("Assignment due date must be within the term dates (Spring 2025: Jan 15 - May 15)");
                    }
                    throw new Error(errorData.message || 'Failed to add assignment');
                } catch (e) {
                    throw new Error(text || 'Failed to add assignment');
                }
            }
            return text ? JSON.parse(text) : {};
        })
        .then(data => {
            setMessage('Assignment added successfully');
            onAssignmentAdded();
            setTimeout(onClose, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
            setMessage('Error: ' + error.message);
        });
    };

    // Get min and max dates for the date input
    const minDate = startDate || '2025-01-15';
    const maxDate = endDate || '2025-05-15';

    return (
        <div>
            <h4>Add New Assignment</h4>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            
            <div>
                <p>Assignment due date must be within term dates:</p>
                <ul>
                    <li>Term Start: {formatDate(minDate)}</li>
                    <li>Term End: {formatDate(maxDate)}</li>
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
                </div>
                <div>
                    <button type="submit">Add Assignment</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AssignmentAdd;
