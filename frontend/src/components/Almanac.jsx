import React from 'react';

const Almanac = () => {
    return (
        <div>
            <h1>Almanac 2024</h1>
            <div className="pdf-container" style={{
                width: '84vw', 
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
                    src="/B.Tech Almanac_M-2024_ UG2,3,4.pdf" 
                    className="pdf-frame" 
                    frameBorder="0" 
                    style={{
                        width: '90vw', 
                        height: '90vh', 
                        border: 'none',
                        backgroundColor: 'white' 
                    }}
                    title="Almanac PDF"
                ></iframe>
            </div>
        </div>
    );
};

export default Almanac;
