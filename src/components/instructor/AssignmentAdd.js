import React, { useState } from 'react';
import { SERVER_URL } from '../../Constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getAuthHeader } from '../../auth/getAuthHeader';

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

function AssignmentAdd({ secNo, onClose, onAssignmentAdded }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

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
            dueDate,
            secNo: parseInt(secNo)
        };

        fetch(`${SERVER_URL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(assignment)
        })
        .then(async response => {
            const text = await response.text();
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(text);
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
            setMessage(`Error: ${error.message}`);
        });
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Add New Assignment</DialogTitle>
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
                        Add Assignment
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AssignmentAdd;
