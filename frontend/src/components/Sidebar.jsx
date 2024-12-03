import * as React from 'react';
import { Box } from "@mui/material";
import { styled } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

// importing required icons from material ui
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const theme = createTheme({ breakpoints: { values: { md: 1380 } } });
const SidebarListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: "30px 0px 0px 30px",
    paddingRight: "0px",
    marginRight: "0px",
    width: "100%",
    height: "60px",
    transition: "none",

    // Hover and selected styles
    '&.Mui-selected': {
        backgroundColor: "#f6f7f6",
        '&::before': {
            content: '""',
            position: "absolute",
            top: "-50px",
            right: "0px",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: "35px 35px 0px 10px #f6f7f6",
        },
        '&::after': {
            content: '""',
            position: "absolute",
            top: "60px",
            right: "0px",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: "35px -35px 0px 10px #f6f7f6",
        },
        '& .MuiTypography-root, & .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
        '&:hover': {
            backgroundColor: "#f6f7f6",
            '& .MuiTypography-root, & .MuiSvgIcon-root': {
                color: theme.palette.primary.main,
            },
        },
    },

    // Default hover styles
    '&:hover': {
        backgroundColor: "#f6f7f6",
        '& .MuiTypography-root, & .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
        '&::before': {
            content: '""',
            position: "absolute",
            top: "-50px",
            right: "0px",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: "35px 35px 0px 10px #f6f7f6",
        },
        '&::after': {
            content: '""',
            position: "absolute",
            top: "60px",
            right: "0px",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: "35px -35px 0px 10px #f6f7f6",
        },
    },

    // Breakpoint adjustments for medium screens
    [theme.breakpoints.down('md')]: {
        margin: "0px 10px 0px 0px",
        borderRadius: "10px",
        '&::before, &::after': {
            display: "none",
        },
    },
}));

const SideMenu = styled('div')(({ theme }) => ({
    backgroundColor: (theme.vars ?? theme).palette.primary.main,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    overflow: "hidden",
}));

function Sidebar({ drawerWidth, mobileOpen, handleDrawerClose, sidbarActive, setSidebarActive }) {
    const [setHover, setIsHovered] = React.useState(false);

    const navigate = useNavigate();
    const DivFullWidth = styled('div')({
        width: "100%",
    })

    // const LogoContainer = styled('div')({
    //     position: 'relative',
    //     height: 40,
    //     '& img': {
    //         maxHeight: 40,
    //     },
    // });

    const topIcons = {
        Dashboard: <AutoAwesomeMosaicOutlinedIcon sx={{ color: "white" }} />,
        TimeTable: <EditCalendarOutlinedIcon sx={{ color: "white" }} />,
        Almanac: <CalendarMonthIcon sx={{ color: "white" }} />,
        Support: <SupportAgentIcon sx={{ color: "white" }} />,
        Faculty: <AssignmentIndIcon sx={{ color: "white" }} />
    };
    const bottomIcons = { Settings: < SettingsIcon sx={{ color: "white" }} /> };

    const drawer = (
        <SideMenu>
            <DivFullWidth>
                <Toolbar >
                    <Stack direction="row" justifyContent="center" height="180px" paddingTop="30px" width="100%" border="None">
                        {/* <LogoContainer><img src="./logo.png"></img></LogoContainer> */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: '700',
                                color: "white"//(theme) => (theme.vars ?? theme).palette.primary.main,
                            }}
                        >
                            TuteeTutor
                        </Typography>
                    </Stack>
                </Toolbar>
                <List>
                    {Object.entries(topIcons).map(([key, value]) => (
                        <ListItem sx={{ pl: 2 }} key={key} disablePadding width="100%">
                            <SidebarListItemButton
                                selected={key.toLowerCase() === sidbarActive.toLowerCase() && !setHover} // Set selected state to true if key matches active sidebar item
                                onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => {
                                    handleDrawerClose();
                                    setSidebarActive(key);
                                    navigate(key.toLowerCase());
                                    setIsHovered(false);
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 34 }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} sx={{
                                    '& .MuiTypography-root': {
                                        color: "white",
                                        fontWeight: '500',
                                    },
                                }} />
                            </SidebarListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
            <DivFullWidth>
                <List>
                    {Object.entries(bottomIcons).map(([key, value]) => (
                        <ListItem sx={{ pl: 2 }} key={key} disablePadding>
                            <SidebarListItemButton
                                selected={key === sidbarActive && !setHover} // Set selected state to true if key matches active sidebar item
                                onClick={() => {
                                    setSidebarActive(key);
                                    navigate(key.toLowerCase());
                                    handleDrawerClose();
                                    setIsHovered(false);
                                }}
                                onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <ListItemIcon sx={{ minWidth: 34, color: "white" }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} sx={{ color: "white" }} />
                            </SidebarListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
        </SideMenu >
    );
    return (
        <Box
            component="nav"
            sx={{
                // width: { md: drawerWidth }, flexShrink: { md: 0 },
                backgroundColor: "white",
                [theme.breakpoints.up('md')]: {
                    width: drawerWidth,
                    flexShrink: 0,
                },
            }}
            aria-label="mailbox folders"
        >
            <Drawer
                //   container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    border: 'none',
                    display: 'block',
                    [theme.breakpoints.up('md')]: {
                        display: `none`,
                    },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    // display: { xs: 'none', md: 'block' },
                    display: 'none',
                    [theme.breakpoints.up('md')]: {
                        display: `block`,
                    },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: drawerWidth,   // Remove box-shadow
                        borderRight: 'none',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default Sidebar;