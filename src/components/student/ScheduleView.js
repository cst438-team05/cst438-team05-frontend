import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';
import TextField from "@mui/material/TextField";

// student can view schedule of sections 
// use the URL /enrollments?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollments/{enrollmentId}

const ScheduleView = (props) => {
    const headers = ["Section ID", "Title", "Credits", "Actions"];
    const [schedules, setSchedules] = useState([]);
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [message, setMessage] = useState('');

    const fetchSchedules = async () => {
        if (!year || !semester){
            setMessage("Please select year and semester");
            return;
        }
        try {
            const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=${year}&semester=${semester}`);
            if (response.ok) {
                const data = await  response.json();
                setSchedules(data);
                setMessage('');
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const dropCourse = async (enrollmentId) => {
        try {
            // delete the enrollment
            const response = await fetch (`${SERVER_URL}/enrollments/${enrollmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Schedule deleted");
                fetchSchedules();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    };

    useEffect( () => {
        if (year && semester){
            fetchSchedules();
        }
    }, [year, semester]);

    return(
        <div >
            <h3>Schedules</h3>
            <h4>{message}</h4>
            <div>
                <TextField
                    id = "year"
                    label = "Year"
                    name = "year"
                    varian = "standard"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}>
                </TextField>
            </div>
            <div>
                <TextField
                    id = "semester"
                    label = "Semester"
                    name = "semester"
                    varian = "standard"
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}>
                </TextField>
            </div>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                {schedules.map((s) => (
                    <tr key={s.enrollmentId}>
                        <td>{s.secId}</td>
                        <td>{s.title}</td>
                        <td>{s.credits}</td>
                        <td style={{display: 'none'}}>{s.secNo}</td>
                        <td><Button onClick={() => dropCourse(s.enrollmentId)} id={s.secNo}> Drop Course </Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div >
    );
}

export default ScheduleView;
