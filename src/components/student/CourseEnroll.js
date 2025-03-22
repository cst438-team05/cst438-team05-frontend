import React, {useState, useEffect} from 'react';
import Button from "@mui/material/Button";
import {SERVER_URL} from '../../Constants';

// students displays a list of open sections for a
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/open`);

            if (response.ok){
                const sections = await response.json();
                setSections(sections);
                setMessage('');
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
            }
        } catch (err) {
            setMessage ("Unable to fetch sections: " + err);
        }
    };

    const enrollAction = async (secNo) => {
        try {
            const response = await fetch (`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`,
                {
                    method: 'POST'
                });
            if (response.ok) {
                setMessage(`Successfully enrolled in the section: ${secNo}`);
            } else {
                const json = await response.json();
                setMessage("Enrollment error: " + json.message);
            }
        } catch (err) {
            setMessage("Unable to enroll due to: " + err);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div>
            <h3>Course Enrollment</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Section ID</th>
                    <th>Building</th>
                    <th>Room</th>
                    <th>Times</th>
                    <th>Instructor Name</th>
                    <th>Instructor Email</th>
                    <th>Enroll</th>
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.secNo}>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.courseId}</td>
                        <td>{s.title}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td>{s.instructorName}</td>
                        <td>{s.instructorEmail}</td>
                        <td><Button onClick={() => enrollAction(s.secNo)}> Enroll </Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;
