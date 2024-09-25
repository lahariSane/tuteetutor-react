import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from "react-router-dom";

const drawerWidth = 250;
const navBarHeight = 64;

function Home(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [sidbarActive, setSidebarActive] = React.useState("Dashboard");

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };


    const handleDrawerToggle = () => {
            setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: `100vh`, backgroundColor: "#f6f7f6", alignItems: "center", justifyContent: "center", overflowX: "auto", overflowY: "auto", width: "100vw" }}>
            <CssBaseline />
            <Navbar
                sx={{ position: 'fixed', width: '100%', height: `${navBarHeight}px` }}
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
                sidbarActive={sidbarActive} />

            <Outlet context={{ drawerWidth: drawerWidth }} />
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
