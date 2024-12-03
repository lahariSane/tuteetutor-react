import React from 'react'


export default function Profile() {
    return (
        <div className='outer-container'>
            <div className='inner-container-1'>
                <div className='box-1'>
                    <div className="profile-container">
                        <div className="header">
                            <div class="edit-icon">✏️</div>
                        </div>
                        <div className="profile-content">
                            <div className="profile-photo">
                                <img className='profile-picture' src="https://via.placeholder.com/100" alt="Profile Photo" />
                            </div>
                            <div style={{ position: 'relative', top: "-3em" }}>
                                <h2 style={{ marginBottom: '0.3em' }}>Your Photo</h2>
                                <p>This will be displayed on your profile</p>
                            </div>
                            <div className="buttons">
                                <button className="upload-button">Upload New</button>
                                <button className="save-button">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='box-2'>
                    <div className="personal-info">
                        <div style={{ borderBottom: '2px solid #007bff' }}>
                            <h2 style={{ marginBottom: '0.3em' }} > <b> Personal Information</b></h2>
                        </div>
                        <form className="personal-info-form" style={{ marginTop: '1em' }}>
                            <div className="form-group">
                                <label htmlFor="fullName"><b>Full Name</b></label>
                                <div className="input-wrapper">
                                    <span className="icon">👤</span>
                                    <input type="text" id="fullName" placeholder="Full Name" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email"> <b> Email address</b></label>
                                <div className="input-wrapper">
                                    <span className="icon">📧</span>
                                    <input type="email" id="email" placeholder="Email" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="role"><b>Role</b></label>
                                <div className="input-wrapper">
                                    <input type="text" id="role" placeholder="Role" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="inner-container-2">
                <div className='box-3'>
                    <div className="bio">
                        <div style={{ borderBottom: '2px solid white' }}>
                            <h2 style={{ marginBottom: '0.3em', color: 'white' }} > <b> Bio</b></h2>
                        </div>
                        <div className="bio-content">
                            <textarea width="40em" id="bio" placeholder="Write something about yourself..." rows="4" cols="50" minRows="4"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}
