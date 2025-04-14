import React, { useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

function AssignmentUpdate({ assignment, onClose, onAssignmentUpdated }) {
    const [title, setTitle] = useState(assignment.title);
    const [dueDate, setDueDate] = useState(assignment.dueDate);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setMessage('Error: Title is required');
            return;
        }

        if (!dueDate) {
            setMessage('Error: Due date is required');
            return;
        }

        const updatedAssignment = {
            id: assignment.id,
            title: title.trim(),
            dueDate,
            secNo: assignment.secNo
        };

        try {
            const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updatedAssignment)
            });

            const text = await response.text();
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Failed to update assignment');
                } catch (e) {
                    throw new Error(text || 'Failed to update assignment');
                }
            }

            setMessage('Assignment updated successfully');
            onAssignmentUpdated();
            setTimeout(onClose, 1500);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Update Assignment</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent style={{ paddingTop: 20 }}>
                    {message && (
                        <p style={{ 
                            color: message.includes('Error') ? '#f44336' : '#4caf50',
                            margin: '0 0 20px 0' 
                        }}>
                            {message}
                        </p>
                    )}
                    <TextField
                        autoFocus
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Update Assignment
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AssignmentUpdate;
