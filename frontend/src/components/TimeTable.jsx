import React from 'react';

const TimeTable = () => {
    return (
        <div>
            <h1>Time Table 2024</h1>
            <div className="pdf-container" style={{
                width: '85vw', 
                height: '100vh', 
                backgroundColor: '#1877d2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                marginLeft: "31rem",
                marginTop: "3rem",
                borderRadius: '10px' 
            }}>
                <iframe 
                    src="Timetable M 2024 -  Timetable M 2024 UG1234.pdf" 
                    className="pdf-frame" 
                    frameBorder="0" 
                    style={{
                        width: '90vw', 
                        height: '90vh', 
                        border: 'none',
                        backgroundColor: 'white' 
                    }}
                    title="Time Table PDF"
                ></iframe>
            </div>
        </div>
    );
};

export default TimeTable;
