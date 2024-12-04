import React from 'react';

const timetable = () => {
    return (
        <div>
            <h1>timetable 2024</h1>
            <div className="pdf-container" style={{
                width: '87vw', 
                height: '110vh', 
                backgroundColor: '#1877d2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                marginLeft: "31rem",
                marginTop: "3rem",
                borderRadius: '10px',
                left: "-250px",
                position: "relative"
            }}>
                <iframe 
                    src="/Timetable M 2024 -  Timetable M 2024 UG1234.pdf" 
                    className="pdf-frame" 
                    frameBorder="0" 
                    style={{
                        width: '90vw', 
                        height: '90vh', 
                        border: 'none',
                        backgroundColor: 'white' 
                    }}
                    title="timetable PDF"
                ></iframe>
            </div>
        </div>
    );
};

export default timetable;
