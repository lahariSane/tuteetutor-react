import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const drawerWidth = 250;
const navBarHeight = 64;

function Home(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the JWT and extract the role
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);

                // Check token expiration (optional)
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("Token has expired");
                    localStorage.removeItem('token'); // Remove expired token
                    navigate('/landing-page'); // Redirect to login if token is expired
                }
            } catch (error) {
                console.error("Invalid token");
            }
        }
        else {
            navigate('/landing-page'); // Redirect to login if token is not present
        }
    }, [navigate]);

    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();
    const [sidbarActive, setSidebarActive] = useState(location.pathname !== "/" ? location.pathname.slice(1) : "Dashboard");

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{
            display: 'flex',
            height: `calc(100vh + 100px)`,
            backgroundColor: "#f6f7f6",
            alignItems: "center",
            justifyContent: "center",
            overflow: "scroll",
            width: "100vw"
        }}>
            <CssBaseline />
            <Navbar
                sx={{
                    position: 'fixed',
                    width: '100%',
                    height: `${navBarHeight}px`
                }}
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
                user={user}
                sidbarActive={sidbarActive} />

            <Outlet context={{ drawerWidth, user }} />
            <Sidebar
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerClose={handleDrawerClose}
                sidbarActive={sidbarActive}
                setSidebarActive={setSidebarActive}
            />
        </Box>
    );
}

export default Home;
