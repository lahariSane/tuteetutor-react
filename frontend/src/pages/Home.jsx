import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StudentDashboard from './StudentDashboard';

const drawerWidth = 250;
const navBarHeight = 64;

function Home(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [sidbarActive, setSidebarActive] = React.useState("Dashboard");


    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100%', backgroundColor: "#f6f7f6", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
            <CssBaseline />
            <Navbar
                sx={{ position: 'fixed', width: '100%', height: `${navBarHeight}px` }}
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
                sidbarActive={sidbarActive} />
            <StudentDashboard drawerWidth={drawerWidth} />
            <Sidebar
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerClose={handleDrawerClose}
                handleDrawerTransitionEnd={handleDrawerTransitionEnd}
                sidbarActive={sidbarActive}
                setSidebarActive={setSidebarActive}
            />
        </Box>
    );
}

export default Home;
