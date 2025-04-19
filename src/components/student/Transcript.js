import React, {useState, useEffect} from 'react';
import { getAuthHeader } from '../../auth/getAuthHeader';
import { SERVER_URL } from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcripts
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    // Empty array state variable to hold transcript data
    const [transcript, setTranscript] = useState([]);

    // Fetch data from the REST API
    useEffect(() => {
        fetch(`${SERVER_URL}/transcripts`, {
            headers: {
                ...getAuthHeader(),
            }
        })
            .then(response => response.json())
            // Set the data to the transcript state variable
            .then(data => { setTranscript(data); })
            .catch(error => console.error('Error fetching transcript data: ', error));
    }, []);

    const tableStyle = {
        margin: "auto",
        borderCollapse: "separate",
        borderSpacing: "10px"
    }

    const cellStyle = {
        textAlign: "left",
        padding: "5px"
    }

    return(
        <div>
            <h3>Transcript</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Year</th>
                        <th style={cellStyle}>Semester</th>
                        <th style={cellStyle}>Course ID</th>
                        <th style={cellStyle}>Section ID</th>
                        <th style={cellStyle}>Title</th>
                        <th style={cellStyle}>Credits</th>
                        <th style={cellStyle}>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.map((enrollment, index) => (
                        // Map each EnrollmentDTO to a table row
                        <tr key={index}>
                            <td style={cellStyle}>{enrollment.year}</td>
                            <td style={cellStyle}>{enrollment.semester}</td>
                            <td style={cellStyle}>{enrollment.courseId}</td>
                            <td style={cellStyle}>{enrollment.secId}</td>
                            <td style={cellStyle}>{enrollment.title}</td>
                            <td style={cellStyle}>{enrollment.credits}</td>
                            <td style={cellStyle}>{enrollment.grade ?? ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;
